module Travis
  module Web
    class Allow
      attr_accessor :app, :allow, :response

      def initialize(app, options = {})
        @app      = app
        @allow    = options[:allow] || ['GET', 'HEAD']
        @response = options.fetch(:response) do
          body    = 'request method not allowed'
          headers = {
            'Content-Type'   => 'text/plain',
            'Allow'          => allow.join(', '),
            'Content-Length' => body.bytesize.to_s
          }
          [405, headers, [body]]
        end
      end

      def call(env)
        allow?(env) ? app.call(env) : response
      end

      def allow?(env)
        allow.include? env['REQUEST_METHOD']
      end
    end
  end
end
