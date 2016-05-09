module Travis
  module Web
    autoload :Allow,             'travis/web/allow'
    autoload :ApiRedirect,       'travis/web/api_redirect'
    autoload :App,               'travis/web/app'
    autoload :Config,            'travis/web/config'
    autoload :SetToken,          'travis/web/set_token'
    autoload :SentryDeployHook,  'travis/web/sentry_deploy_hook'
  end

  def self.config
    @config ||= Travis::Web::Config.new
  end
end
