class Travis::Web::App::Filter
  class Endpoint
    DEFAULT_ENDPOINT = 'https://api.travis-ci.org'

    attr_reader :config

    def initialize(config)
      @config = config
    end

    def apply(string)
      string.gsub(DEFAULT_ENDPOINT, config.api_endpoint)
    end
  end
end
