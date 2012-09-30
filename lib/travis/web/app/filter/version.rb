class Travis::Web::App::Filter
  class Version
    ASSET_DIRS = %r(/(stylesheets|javascripts)/)

    attr_reader :config

    def initialize(config)
      @config = config
    end

    def apply(string)
      string.gsub(ASSET_DIRS) { |match| "/#{config.version}/#{$1}/" }
    end
  end
end

