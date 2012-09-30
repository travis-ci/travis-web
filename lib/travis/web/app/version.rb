class Travis::Web::App
  class Version
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
        app.call(env.merge('PATH_INFO' => strip_version(path)))
      else
       [404, { 'Content-Type' => 'text/html', 'Content-Length' => '9' }, ['not found']]
      end
    end

    private

      def pass?(path)
        ['/', '/index.html', 'current'].include?(path)
      end

      def versioned?(path)
        path.starts_with?("/#{config.version}/")
      end

      def strip_version(path)
        path.sub(%r(/#{config.version}/), '')
      end
  end
end
