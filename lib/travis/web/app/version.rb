class Travis::Web::App
  class Version
    include Helpers

    attr_reader :app, :config

    def initialize(app, config)
      @app = app
      @config = config
    end

    def call(env)
      path = env['PATH_INFO']
      if pass?(path)
        app.call(env)
      elsif versioned?(path)
        app.call(map_env(env, config.version))
      else
        not_found
      end
    end

    private

      def pass?(path)
        ['/', '/index.html', 'current'].include?(path)
      end

      def versioned?(path)
        path.starts_with?("/#{config.version}/")
      end

      def not_found
        [404, { 'Content-Type' => 'text/html', 'Content-Length' => '9', 'X-Cascade' => 'pass' }, ['not found']]
      end
  end
end
