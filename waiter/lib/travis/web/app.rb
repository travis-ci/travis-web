# frozen_string_literal: true

require 'rack'
require 'rack/ssl'
require 'rack/protection'
require 'delegate'
require 'time'
require 'json'
require 'travis/utils/deep_merge'
require 'digest/md5'
require 'erb'

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
    route[1]['Date'] = Time.now.httpdate
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
        'Content-Length' => content.bytesize.to_s,
        'Cache-Control' => cache_control(file),
        'Content-Location' => path_for(file),
        'Content-Type' => mime_type(file),
        'Expires' => expires(file),
        'ETag' => fingerprint(file)
      }
    else
      set_config(content, options) if config_needed?(file)
      set_title(content) if index?(file)

      headers = {
        'Content-Length' => content.bytesize.to_s,
        'Cache-Control' => cache_control(file),
        'Content-Location' => path_for(file),
        'Content-Type' => mime_type(file),
        'Last-Modified' => server_start.httpdate,
        'Expires' => expires(file),
        'Vary' => vary_for(file),
        'ETag' => Digest::MD5.hexdigest(content)
      }
    end

    [200, headers, [content]]
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
    when '/' then 'public, must-revalidate, max-age=0'
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
    when '/' then 'Accept'
    else ''
    end
  end

  def path_for(file)
    file = file.sub("#{root}/", '')
    file = '' if index?(file)
    "/#{file}"
  end

  def mime_type(file)
    Rack::Mime.mime_type File.extname(file)
  end

  def set_title(content) # rubocop:disable Naming/AccessorMethodName
    content.gsub! %r{/(<title>).*(</title>)/, "\\1#{title}\\2"}
  end

  def title
    default_title = 'Travis CI - Test and Deploy Your Code with Confidence'
    ENV['SITE_TITLE'] || default_title
  end

  def set_assets_host(content) # rubocop:disable Naming/AccessorMethodName
    content.gsub!(/\{\{assets_host\}\}/, ENV['ASSETS_HOST'] || '')
  end

  def set_config(string, _opts = {}) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/MethodLength
    # TODO: clean up
    config = {}

    config['featureFlags'] ||= {}

    options[:enable_feature_flags]&.split(',')&.each do |flag|
      config['featureFlags'][flag.strip] = true
    end

    if options[:pro]
      config['pro'] = true
      config['featureFlags']['pro-version'] = true
      config['featureFlags']['github-apps'] = true
    end
    if options[:enterprise]
      config['enterprise'] = true
      config['featureFlags']['enterprise-version'] = true
    end

    if ENV['REDIRECT']
      config['featureFlags']['redirect'] = true
    end

    if options[:github_apps_app_name]
      config['githubApps'] ||= {}
      config['githubApps']['appName'] = options[:github_apps_app_name]
      config['githubApps']['migrationRepositoryCountLimit'] = 50
      end

    config['publicMode'] = !options[:public_mode].nil? && (options[:public_mode] == 'true' || options[:public_mode] == true)

    if config['enterprise']
      config['pagesEndpoint'] = false
      config['billingEndpoint'] = false
    else
      config['pagesEndpoint'] = options[:pages_endpoint] if options[:pages_endpoint]
      config['billingEndpoint'] = options[:billing_endpoint] if options[:billing_endpoint]
    end

    config['defaultTitle'] = title
    config['apiEndpoint'] = options[:api_endpoint] if options[:api_endpoint]
    config['authEndpoint'] = options[:auth_endpoint] if options[:auth_endpoint]
    config['apiTraceEndpoint'] = options[:api_trace_endpoint] if options[:api_trace_endpoint]
    config['githubAppsEndpoint'] = options[:github_apps_endpoint]
    source_endpoint = options[:source_endpoint]
    if source_endpoint
      config['sourceEndpoint'] = source_endpoint
      config['githubAppsEndpoint'] = "#{source_endpoint}/github-apps" unless source_endpoint.include? 'github.com'
    end
    pusher = {}
    pusher['key'] = options[:pusher_key] if options[:pusher_key]
    pusher['host'] = options[:pusher_host] if options[:pusher_host]
    pusher['path'] = options[:pusher_path] if options[:pusher_path]
    pusher['channelPrefix'] = options[:pusher_channel_prefix] if options[:pusher_channel_prefix]
    pusher['encrypted'] = true
    config['pusher'] = pusher

    if options[:stripe_publishable_key]
      stripe = {}
      stripe['publishableKey'] = options[:stripe_publishable_key]
      stripe['lazyLoad'] = true
      config['stripe'] = stripe
    end

    config['gaCode'] = options[:ga_code] if options[:ga_code]

    config['githubOrgsOauthAccessSettingsUrl'] = options[:github_orgs_oauth_access_settings_url]
    config['ajaxPolling'] = true if options[:ajax_polling]
    config['userlike'] = true if options[:userlike]
    config['logLimit'] = options[:log_limit] if options[:log_limit]

    config['endpoints'] = {
      'sshKey' => options[:ssh_key_enabled],
      'caches' => options[:caches_enabled]
    }

    if options[:default_provider]
      provider = options[:default_provider]
      config['providers'] ||= {}
      config['providers'][provider] ||= {}
      config['providers'][provider]['isDefault'] = true
    end

    config['intercom'] ||= {}
    config['intercom']['appid']= options[:intercom_app_id] || 'placeholder'
    config['intercom']['enabled'] = !!options[:intercom_app_id]

    if ENV['ENDPOINT_PORTFOLIO']
      config['providers'] ||= {}
      config['providers']['assembla'] ||= {}
      config['providers']['assembla']['endpointPortfolio'] = ENV['ENDPOINT_PORTFOLIO']
    end

    if ENV['GITHUB_ORGS_OAUTH_ACCESS_SETTINGS_URL']
      config['providers'] ||= {}
      config['providers']['github'] ||= {}
      config['providers']['github']['paths'] ||= {}
      config['providers']['github']['paths']['accessSettings'] = ENV['GITHUB_ORGS_OAUTH_ACCESS_SETTINGS_URL']
    end

    if ENV['AIDA_CLIENT_ID']
      aida = {}
      aida['clientId'] = ENV['AIDA_CLIENT_ID']
      aida['clientKey'] = ENV['AIDA_CLIENT_KEY']
      config['aida'] = aida
    end

    if ENV['DISABLE_AIDA']
      config['disableAida'] = ENV['DISABLE_AIDA']
    end

    config['metricsAdapters'] = []

    if ENV['GOOGLE_ANALYTICS_ID']
      config['metricsAdapters'].push({
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: ENV['GOOGLE_ANALYTICS_ID'],
          debug: @options[:environment] === 'development',
          trace: @options[:environment] === 'development',
          sendHitTask: @options[:environment] != 'development',
        }
      })
    end

    if ENV['GOOGLE_TAGS_CONTAINER_ID']
      config['metricsAdapters'].push({
        name: 'GoogleTagManager',
        environments: ['development', 'production'],
        config: {
          id: ENV['GOOGLE_TAGS_CONTAINER_ID'],
          envParams: ENV['GOOGLE_TAGS_PARAMS']
        }
      })
    end

    config['gReCaptcha'] ||= {}
    if ENV['GOOGLE_RECAPTCHA_SITE_KEY']
      config['gReCaptcha']['siteKey'] = ENV['GOOGLE_RECAPTCHA_SITE_KEY']
    end

    if ENV['TRIAL_DAYS']
      config['trialDays'] = ENV['TRIAL_DAYS']
    end

    if ENV['DISABLE_SENTRY']
      config['sentry']['development'] = true
    end

    config['tempBanner'] ||= {}
    config['tempBanner']['tempBannerEnabled'] = ENV['TEMPORARY_ANNOUNCEMENT_BANNER_ENABLED'] || false
    config['tempBanner']['tempBannerMessage'] = ENV['TEMPORARY_ANNOUNCEMENT_MESSAGE'] || ''

    regexp = %r{<meta name="travis/config/environment"\s+content="([^"]+)"}
    string.gsub!(regexp) do
      ember_config = JSON.parse(CGI.unescape(::Regexp.last_match(1)))

      config = deep_merge ember_config, config
      config = ERB::Util.url_encode config.to_json

      %(<meta name="travis/config/environment" content="#{config}")
    end
  end
end
