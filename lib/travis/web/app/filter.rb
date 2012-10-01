class Travis::Web::App
  class Filter
    autoload :Endpoint, 'travis/web/app/filter/endpoint'
    autoload :Assets,   'travis/web/app/filter/assets'

    attr_reader :app, :config, :filters

    def initialize(app, config)
      @app = app
      @config = config
      @filters = [Endpoint.new(config), Assets.new(config)]
    end

    def call(env)
      status, headers, body = app.call(env)
      headers, body = filter(headers, body) if content_type?(headers, 'text/html')
      [status, headers, body]
    end

    private

      def filter(headers, body)
        headers.delete 'Content-Length' # why don't we just set this to the new length?
        filtered = []
        body.each { |s| filtered << filters.inject(s) { |s, filter| filter.apply(s) } }
        body.close if body.respond_to?(:close)
        [headers, filtered]
      end

      def content_type?(headers, type)
        headers.any? { |key, value| key.downcase == 'content-type' and value.start_with?(type)  }
      end
  end
end
