class Travis::Web::App
  class Assets
    include Helpers

    attr_reader :app, :config

    def initialize(app, config)
      @app = app
      @config = config
    end

    def call(env)
      path = env['PATH_INFO']
      env = map_env(env, config.version) if asset?(path)
      app.call(env)
    end

    private

      def asset?(path)
        path =~ Travis::Web::App::ASSET_DIRS
      end
  end
end
