class Travis::Web::App::Filter
  class Endpoint
    DEFAULT_ENDPOINT = 'https://api.travis-ci.org'

    attr_reader :config

    def initialize(config)
      @config = config
    end

    def apply(string)
      apply? ? string.gsub(DEFAULT_ENDPOINT, config.api_endpoint) : string
    end

    def apply?
      config.api_endpoint != DEFAULT_ENDPOINT
    end
  end
end
