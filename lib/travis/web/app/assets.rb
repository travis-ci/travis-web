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
      if !asset?(path)
        app.call(map_env(env, config.version))
      else
        app.call(env)
      end
    end

    private

      def asset?(path)
        path !~ Travis::Web::App::ASSET_DIRS
      end
  end
end
