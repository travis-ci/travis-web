require 'rack'
require 'rack/ssl'
require 'rack/protection'
require 'delegate'
require 'time'
require 'json'
require 'travis/utils/deep_merge'

class Travis::Web::App
  autoload :AltVersions,    'travis/web/app/alt_versions'
  autoload :MobileRedirect, 'travis/web/app/mobile_redirect'
  include Travis::DeepMerge

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
          'Expires'          => expires(file),
          'ETag'             => fingerprint(file)
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
          'Expires'          => expires(file),
          'Vary'             => vary_for(file),
          'ETag'             => Digest::MD5.hexdigest(content)
        }
        if csp_needed?(file)
          headers['Content-Security-Policy-Report-Only'] = csp_header(content, options)
        end
      end

      [ 200, headers, [content] ]
    end

    def each_file
      Dir.glob(File.join(root, '**/*')) { |file| yield file if File.file?(file) }
    end

    def config_needed?(file)
      index?(file) || file.end_with?('spec.html')
    end
    alias csp_needed? config_needed?

    def index?(file)
      file == File.join(root, 'index.html') || file == 'index.html'
    end

    def fingerprint(file)
      basename = File.basename(file)
      extname  = File.extname(file)
      if result = basename.scan(/.+-([a-f0-9]{32})#{extname}$/)
        result.flatten[0]
      end
    end
    alias fingerprinted? fingerprint

    def cache_control(file)
      case path_for(file)
      when '/'        then "public, must-revalidate, max-age=0"
      else "public, max-age=#{age}"
      end
    end

    def expires(file)
      if fingerprinted?(file)
        (server_start + age).httpdate
      else
        '0'
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
      content.gsub!(/(<title>).*(<\/title>)/, "\\1#{title}\\2")
    end

    def title
      default_title = "Travis CI - Test and Deploy Your Code with Confidence"
      ENV['SITE_TITLE'] || default_title
    end

    def set_assets_host(content)
      content.gsub!(/\{\{assets_host\}\}/, ENV['ASSETS_HOST'] || '')
    end

    def set_config(string, opts = {})
      # TODO: clean up
      config = {}

      config['enterprise'] = options[:enterprise] if options[:enterprise]
      if config['enterprise']
        config['pagesEndpoint'] = false
        config['billingEndpoint'] = false
      else
        config['pagesEndpoint'] = options[:pages_endpoint] if options[:pages_endpoint]
        config['billingEndpoint'] = options[:billing_endpoint] if options[:billing_endpoint]
      end

      config['defaultTitle'] = title
      config['apiEndpoint'] = options[:api_endpoint] if options[:api_endpoint]
      config['sourceEndpoint'] = options[:source_endpoint] if options[:source_endpoint]
      pusher = {}
      pusher['key'] = options[:pusher_key] if options[:pusher_key]
      pusher['host'] = options[:pusher_host] if options[:pusher_host]
      pusher['path'] = options[:pusher_path] if options[:pusher_path]
      pusher['channelPrefix'] = options[:pusher_channel_prefix] if options[:pusher_channel_prefix]
      pusher['encrypted'] = true
      config['pusher'] = pusher

      config['gaCode'] = options[:ga_code] if options[:ga_code]
      config['pro'] = options[:pro] if options[:pro]

      config['githubOrgsOauthAccessSettingsUrl'] = options[:github_orgs_oauth_access_settings_url]
      config['ajaxPolling'] = true if options[:ajax_polling]
      config['userlike'] = true if options[:userlike]

      config['endpoints'] = {
        'sshKey' => options[:ssh_key_enabled],
        'caches' => options[:caches_enabled]
      }

      regexp = %r(<meta name="travis/config/environment"\s+content="([^"]+)")
      string.gsub!(regexp) do
        ember_config = JSON.parse(URI.unescape($1))

        config = deep_merge ember_config, config
        config = URI.escape config.to_json

        %(<meta name="travis/config/environment" content="#{config}")
      end
    end

    def csp_header(content, options)
      regexp = %r(<meta name="travis/config/environment"\s+content="(?<config>[^"]+)")
      raw_config = content.match(regexp)['config']
      ember_config = JSON.parse(URI.unescape(raw_config))

      api_endpoint = options[:api_endpoint] || ember_config['apiEndpoint']
      csp = ember_config['contentSecurityPolicyRaw']
      ember_config['cspSectionsWithApiHost'].each do |section_name|
        csp[section_name] += " " + api_endpoint
      end
      if assets_host = ENV['ASSETS_HOST']
        ['script-src', 'style-src', 'img-src'].each do |section_name|
          csp[section_name] += " " + assets_host
        end
      end
      csp.map { |k, v| [k, v].join(" ") }.join("; ") + ';'
    end
end
