require 'rack'
require 'rack/ssl'
require 'rack/cache'
require 'rack/protection'
require 'delegate'
require 'time'

class Travis::Web::App
  autoload :MobileRedirect, 'travis/web/app/mobile_redirect'

  S3_URL = 'https://s3.amazonaws.com/travis-web-production/assets'

  # Simple Rack router that behaves like a hash.
  # Key is the path, value the response.
  class Router < DelegateClass(Hash)
    attr_reader :main_app
    def initialize(main_app)
      @main_app = main_app
      super({})
    end

    def call(env)
      self[env['PATH_INFO']]
    end
  end

  class AltVersions
    attr_reader :app

    def initialize(app)
      @app = app
    end

    def call(env)
      alt = alt_from(env)
      env['travis.alt'] = alt if alt
      status, headers, body = app.call(env)
      set_cookies(headers, env['travis.alt']) if env.key?('travis.alt')
      [status, headers, body]
    end

    def set_cookies(headers, alt)
      headers['Set-Cookie'] = "alt=#{alt}; Max-Age=#{alt == 'default' ? 0 : 86400}"
    end

    def alt_from(env)
      alt_from_params(env) || alt_from_cookie(env)
    end

    def alt_from_params(env)
      alt_from_string env['QUERY_STRING']
    end

    def alt_from_cookie(env)
      alt_from_string env['HTTP_COOKIE']
    end

    def alt_from_string(string)
      $1 if string =~ /alt=([^&]*)/
    end
  end

  class << self
    def new(options = {})
      return super unless options[:environment] == 'development'
      proc { |e| super.call(e) } # poor man's reloader
    end

    def build(options = {})
      builder = Rack::Builder.new
      if options.fetch(:environment) == 'production'
        builder.use Rack::SSL
        builder.use Rack::Cache
      end
      builder.use Rack::Deflater
      builder.use Rack::Head
      builder.use Rack::Protection::XSSHeader
      builder.use Rack::Protection::FrameOptions
      builder.use Rack::Protection::PathTraversal
      builder.use Rack::ConditionalGet
      builder.use Travis::Web::App::AltVersions
      builder.run new(options)
      builder.to_app
    end
  end

  attr_reader :routers, :environment, :version, :last_modified, :age, :options, :root

  def initialize(options = {})
    @options       = options
    @environment   = options.fetch(:environment)
    @root          = options.fetch(:root)
    @version       = File.read File.expand_path('version', root)
    @last_modified = Time.now
    @age           = 60 * 60 * 24 * 365
    @routers       = { default: create_router }
  end

  def call(env)
    name = env['travis.alt'] || :default
    routers[name] ||= create_router(alt: name)
    routers[name].call(env)
  end

  private

    def create_router(options = {})
      router = Router.new(self)
      load_routes(router, options)
      router
    end

    def load_routes(router, options = {})
      each_file { |file| router[path_for(file)] = response_for(file, options) }
      router.default = router['/']
    end

    def response_for(file, options = {})
      content = File.read(file)
      set_config(content, options) if config_needed?(file)

      headers = {
        'Content-Length'   => content.bytesize.to_s,
        'Content-Location' => path_for(file),
        'Cache-Control'    => cache_control(file),
        'Content-Location' => path_for(file),
        'Content-Type'     => mime_type(file),
        'ETag'             => version,
        'Last-Modified'    => last_modified.httpdate,
        'Expires'          => (last_modified + age).httpdate,
        'Vary'             => vary_for(file)
      }

      [ 200, headers, [content] ]
    end

    def each_file
      pattern = File.join(root, '**/*')
      Dir.glob(pattern) { |f| yield f if File.file? f }
    end

    def prefix?(file)
      file =~ /^(styles|scripts)\//
    end

    def config_needed?(file)
      index?(file) || file.end_with?('spec.html')
    end

    def index?(file)
      file.end_with?('index.html')
    end

    def cache_control(file)
      case path_for(file)
      when '/'        then "public, must-revalidate"
      when '/version' then "no-cache"
      else "public, max-age=#{age}"
      end
    end

    def vary_for(file)
      case path_for(file)
      when '/'         then 'Accept'
      when '/version'  then '*'
      else ''
      end
    end

    def path_for(file)
      file = file.sub("#{root}/", '')
      file = File.join(version, file) if prefix?(file)
      file = "" if index?(file)
      "/#{file}"
    end

    def mime_type(file)
      Rack::Mime.mime_type File.extname(file)
    end

    def set_config(string, opts = {})
      string.gsub! %r(<meta (rel|name)="travis\.([^"]*)" (href|value)="([^"]*)"[^>]*>) do
        %(<meta #{$1}="travis.#{$2}" #{$3}="#{options[$2.to_sym] || $4}">)
      end

      string.gsub! %r{(src|href)="(?:\/?)((styles|scripts)\/[^"]*)"} do
        %(#{$1}=#{opts[:alt] ? "#{S3_URL}/#{opts[:alt]}/#{$2}" : "/#{version}/#{$2}"})
      end
    end
end
