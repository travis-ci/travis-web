class Travis::Web::App
  class Filter
    class Config
      CONFIG_TAG = %r(<meta (rel|name)="([^"]*)" (href|value)="([^"]*)"[^>]*>)

      attr_reader :config

      def initialize(config)
        @config = config
      end

      def apply?
        config.api_endpoint != DEFAULT_ENDPOINT ||
        config.pusher_key   != DEFAULT_PUSHER_KEY
      end

      def apply(string)
        string.gsub(CONFIG_TAG) do
          %(<meta #{$1}="#{$2}" #{$3}="#{config[$2.split('.').last]}">)
        end
      end
    end
  end
end
