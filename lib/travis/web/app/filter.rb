class Travis::Web::App
  class Filter
    autoload :Config, 'travis/web/app/filter/config'
    autoload :Assets, 'travis/web/app/filter/assets'

    attr_reader :app, :config

    def initialize(app, config)
      @app = app
      @config = config
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
        body.each { |chunk| filtered << filter_chunk(chunk) }
        body.close if body.respond_to?(:close)
        [headers, filtered]
      end

      def filter_chunk(string)
        filters.inject(string) do |string, filter|
          filter.apply? ? filter.apply(string) : string
        end
      end

      def filters
        @filters ||= Filter.constants.map { |name| Filter.const_get(name).new(config) }
      end

      def content_type?(headers, type)
        headers.any? { |key, value| key.downcase == 'content-type' and value.start_with?(type)  }
      end
  end
end
