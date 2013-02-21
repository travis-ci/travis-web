require 'rack'
require 'rack/ssl'
require 'rack/cache'
require 'rack/protection'
require 'delegate'
require 'time'

class Travis::Web::App
  autoload :MobileRedirect, 'travis/web/app/mobile_redirect'

  # Simple Rack router that behaves like a hash.
  # Key is the path, value the response.
  class Router < DelegateClass(Hash)
    attr_reader :main_app
    def initialize(main_app)
      @main_app = main_app
      super({})
    end

    def call(env)
      if main_app.custom_branch?(env)
        main_app.response_for_custom_branch(env)
      else
        self[env['PATH_INFO']]
      end
    end
  end

  def self.new(options = {})
    return super unless options[:environment] == 'development'
    proc { |e| super.call(e) } # poor man's reloader
  end

  attr_reader :app, :router, :environment, :version, :last_modified, :age, :options, :root

  def initialize(options = {})
    @options       = options
    @environment   = options.fetch(:environment)
    @root          = options.fetch(:root)
    @router        = Router.new(self)
    @app           = builder.to_app
    @version       = File.read File.expand_path('version', root)
    @last_modified = Time.now
    @age           = 60 * 60 * 24 * 365
    load_routes
  end

  def call(env)
    app.call(env)
  end

  def response_for_custom_branch(env)
    status, headers, body = response_for File.join(root, 'index.html'), custom_branch: custom_branch(env)
    response = Rack::Response.new body, status, headers

    if disable_custom_branch?(env)
      response.delete_cookie 'custom_branch'
    elsif custom_branch_from_params(env)
      response.set_cookie 'custom_branch', value: custom_branch_from_params(env), expires: Time.now + 31536000
    end

    response.finish
  end

  def custom_branch?(env)
    custom_branch(env) || disable_custom_branch?(env)
  end

  private

    def disable_custom_branch?(env)
      env['QUERY_STRING'] =~ /disable[_-]custom[_-]branch/
    end

    def custom_branch_from_params(env)
      branch = custom_branch_from_string env['QUERY_STRING']
    end

    def custom_branch_from_cookie(env)
      custom_branch_from_string env['HTTP_COOKIE']
    end

    def custom_branch_from_string(string)
      $1 if string =~ /(?<!disable.)custom[_-]branch=([^&]+)/
    end

    def custom_branch(env)
      custom_branch_from_params(env) || custom_branch_from_cookie(env)
    end

    def load_routes
      each_file { |f| router[route_for(f)] = response_for(f) }
      router.default = router['/']
    end

    def response_for(file, options = {})
      content = File.read(file)
      set_config(content, options) if config_needed? file

      headers = {
        'Content-Length'   => content.bytesize.to_s,
        'Content-Location' => route_for(file),
        'Cache-Control'    => cache_control(file),
        'Content-Location' => route_for(file),
        'Content-Type'     => mime_type(file),
        'ETag'             => version,
        'Last-Modified'    => last_modified.httpdate,
        'Expires'          => (last_modified + age).httpdate,
        'Vary'             => vary_for(file)
      }

      [ 200, headers, [ content ] ]
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
      file.end_with? 'index.html'
    end

    def route_for(file)
      file = file.sub("#{root}/", '')
      file = File.join(version, file) if prefix? file
      file = "" if index? file
      "/#{file}"
    end

    def cache_control(file)
      case route_for(file)
      when '/'        then "public, must-revalidate"
      when '/version' then "no-cache"
      else "public, max-age=#{age}"
      end
    end

    def vary_for(file)
      case route_for(file)
      when '/'         then 'Accept'
      when '/version'  then '*'
      else ''
      end
    end

    def mime_type(file)
      Rack::Mime.mime_type File.extname(file)
    end

    def set_config(string, options = {})
      string.gsub! %r(<meta (rel|name)="travis\.([^"]*)" (href|value)="([^"]*)"[^>]*>) do
        %(<meta #{$1}="travis.#{$2}" #{$3}="#{options[$2.to_sym] || $4}">)
      end

      string.gsub! %r{(src|href)="(?:\/?)((styles|scripts)\/[^"]*)"} do
        if options[:custom_branch]
          url = "https://s3.amazonaws.com/travis-web-production/assets/#{options[:custom_branch]}/#{$2}"
          %(#$1="#{url}")
        else
          %(#$1="/#{version}/#$2")
        end
      end
    end

    def builder
      builder = Rack::Builder.new
      if environment == 'production'
        builder.use Rack::SSL
        builder.use Rack::Cache
      end
      builder.use Rack::Deflater
      builder.use Rack::Head
      builder.use Rack::Protection::XSSHeader
      builder.use Rack::Protection::FrameOptions
      builder.use Rack::Protection::PathTraversal
      builder.use Rack::ConditionalGet
      builder.run router
      builder
    end
end
