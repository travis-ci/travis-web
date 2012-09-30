require 'travis/api/app'

class Travis::Web::App
  class Api
    include Helpers

    attr_reader :app, :api, :config

    def initialize(app, config)
      @app = app
      @api = Travis::Api::App.new
      @config = config
    end

    def call(env)
      if matches?(env['PATH_INFO'])
        api.call(map_env(env, config.api_endpoint))
      else
        app.call(env)
      end
    end

    private

      def matches?(path)
        path.starts_with?(config.api_endpoint)
      end
  end
end
