require 'travis/api/app'

class Travis::Web::App
  class Api
    attr_reader :app, :api, :config

    def initialize(app, config)
      @app = app
      @api = Travis::Api::App.new
      @config = config
    end

    def call(env)
      path = env['PATH_INFO']
      if matches?(path)
        api.call(env.merge('PATH_INFO' => api_path(path)))
      else
        app.call(env)
      end
    end

    def matches?(path)
      # TODO there's a redirect through /auth/post_message which doesn't have the /api
      # prefix. is that safe_redirect in travis-api? not sure how to solve this
      path.starts_with?(config.api_endpoint) || path.starts_with?('/auth')
    end

    def api_path(path)
      path.sub(/^#{config.api_endpoint}/, '')
    end
  end
end
