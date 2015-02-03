require 'rack'
require 'rack/ssl'
require 'rack/protection'
require 'delegate'
require 'time'
require 'json'

class Travis::Web::App
  autoload :AltVersions,    'travis/web/app/alt_versions'
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

  class << self
    def new(options = {})
      return super unless options[:environment] == 'development'
      proc { |e| super.call(e) } # poor man's reloader
    end

    def build(options = {})
      builder = Rack::Builder.new
      if options[:environment] == 'production' ||
          options[:environment] == 'staging'
        builder.use Rack::SSL, hsts: Travis.config.ssl.hsts
      end
      builder.use Rack::Deflater
      builder.use Rack::Head
      builder.use Rack::Protection::XSSHeader
      builder.use Rack::Protection::FrameOptions
      builder.use Rack::Protection::PathTraversal
      builder.use Rack::ConditionalGet
      builder.run new(options)
      builder.to_app
    end
  end

  attr_reader :routers,  :age, :options, :root, :server_start

  def initialize(options = {})
    @options      = options
    @server_start = options.fetch(:server_start)
    @root         = options.fetch(:root)
    @age          = 60 * 60 * 24 * 365
    @routers      = { default: create_router }
  end

  def call(env)
    name = env['travis.alt'] || :default
    routers[name] ||= create_router(alt: name)
    route = routers[name].call(env)
    route[1]["Date"] = Time.now.httpdate
    route
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
      if fingerprinted?(file)
        headers = {
          'Content-Length'   => content.bytesize.to_s,
          'Cache-Control'    => cache_control(file),
          'Content-Location' => path_for(file),
          'Content-Type'     => mime_type(file),
          'Expires'          => (server_start + age).httpdate
        }
      else
        set_config(content, options) if config_needed?(file)
        set_title(content) if index?(file)

        headers = {
          'Content-Length'   => content.bytesize.to_s,
          'Cache-Control'    => cache_control(file),
          'Content-Location' => path_for(file),
          'Content-Type'     => mime_type(file),
          'Last-Modified'    => server_start.httpdate,
          'Expires'          => (server_start + age).httpdate,
          'Vary'             => vary_for(file)
        }
      end

      [ 200, headers, [content] ]
    end

    def each_file
      Dir.glob(File.join(root, '**/*')) { |file| yield file if File.file?(file) }
    end

    def config_needed?(file)
      index?(file) || file.end_with?('spec.html')
    end

    def index?(file)
      file == File.join(root, 'index.html') || file == 'index.html'
    end

    def fingerprinted?(file)
      basename = File.basename(file)
      basename =~ /-[a-f0-9]{32}.(css|js)$/
    end

    def cache_control(file)
      case path_for(file)
      when '/'        then "public, must-revalidate"
      else "public, max-age=#{age}"
      end
    end

    def vary_for(file)
      case path_for(file)
      when '/'         then 'Accept'
      else ''
      end
    end

    def path_for(file)
      file = file.sub("#{root}/", '')
      file = "" if index?(file)
      "/#{file}"
    end

    def mime_type(file)
      Rack::Mime.mime_type File.extname(file)
    end

    def set_title(content)
      default_title = "Travis CI - Free Hosted Continuous Integration Platform for the Open Source Community"
      content.gsub!(/\{\{title\}\}/, ENV['SITE_TITLE'] || default_title)
    end

    def set_assets_host(content)
      content.gsub!(/\{\{assets_host\}\}/, ENV['ASSETS_HOST'] || '')
    end

    def set_config(string, opts = {})
      # TODO: clean up
      config = {}
      config['api_endpoint'] = options[:api_endpoint] if options[:api_endpoint]
      config['pages_endpoint'] = options[:pages_endpoint] if options[:pages_endpoint]
      config['billing_endpoint'] = options[:billing_endpoint] if options[:billing_endpoint]
      config['source_endpoint'] = options[:source_endpoint] if options[:source_endpoint]
      pusher = {}
      pusher['key'] = options[:pusher_key] if options[:pusher_key]
      pusher['host'] = options[:pusher_host] if options[:pusher_host]
      pusher['path'] = options[:pusher_path] if options[:pusher_path]
      config['pusher'] = pusher

      config['ga_code'] = options[:ga_code] if options[:ga_code]
      config['pro'] = options[:pro] if options[:pro]
      config['enterprise'] = options[:enterprise] if options[:enterprise]

      config['code_climate'] = options[:code_climate] if options[:code_climate]
      config['code_climate_url'] = options[:code_climate_url] if options[:code_climate_url]

      regexp = %r(<meta name="travis/config/environment"\s+content="([^"]+)")
      string.gsub!(regexp) do
        ember_config = JSON.parse(URI.unescape($1))

        config = ember_config.merge config
        config = URI.escape config.to_json

        %(<meta name="travis/config/environment" content="#{config}")
      end
    end
end
