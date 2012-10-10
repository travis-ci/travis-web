class Travis::Web::App
  class Config
    OPTIONS = %w(ENV API_ENDPOINT CLIENT_ENDPOINT PUSHER_KEY RUN_API WATCH DEFLATE)

    def [](key)
      send(key)
    end

    def keys
      @keys ||= OPTIONS.map(&:downcase)
    end

    def each
      keys.each do |key|
        yield key, send(key)
      end
    end

    def env
      config.fetch(:env, 'development')
    end

    def production?
      env == 'production'
    end

    def run_api?
      !!config.fetch(:run_api, config[:api_endpoint].to_s.start_with?('/'))
    end

    def api_endpoint
      config.fetch(:api_endpoint, run_api? ? '/api' : DEFAULT_ENDPOINT).gsub(/:\d+/, '')
    end

    def client_endpoint
      config.fetch(:client_endpoint, '/')
    end

    def pusher_key
      config.fetch(:pusher_key, DEFAULT_PUSHER_KEY)
    end

    def deflate?
      !!config.fetch(:deflate, production?)
    end

    def watch?
      !!config.fetch(:watch, false)
    end

    alias run_api run_api?
    alias deflate deflate?
    alias watch watch?

    def version
      production? ? @version ||= read_version : read_version
    end

    private

      def config
        @config ||= Hash[*OPTIONS.map do |key|
          [key.downcase.to_sym, cast(ENV[key])] if ENV.key?(key)
        end.compact.flatten]
      end

      def cast(value)
        case value
          when '1', 'true'  then true
          when '0', 'false' then false
          else value
        end
      end

      def read_version
        File.read('public/version').chomp
      end
  end
end
