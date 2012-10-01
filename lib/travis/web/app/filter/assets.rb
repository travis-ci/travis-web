class Travis::Web::App::Filter
  class Assets
    attr_reader :config

    def initialize(config)
      @config = config
    end

    def apply(string)
      string = version(string)
      string = minify(string) # if config.production?
      string
    end

    private

      def version(string)
        string.gsub(Travis::Web::App::ASSET_DIRS) do
          "/#{config.version}/#{$1}/"
        end
      end

      def minify(string)
        string.gsub(%r((/javascripts/.*).js)) do
          "#{$1}.min.js/"
        end
      end
  end
end
