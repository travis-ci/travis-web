require 'rack'
require 'rack/protection/path_traversal'

module Travis::Web
  class App
    autoload :Api,      'travis/web/app/api'
    autoload :Config,   'travis/web/app/config'
    autoload :Files,    'travis/web/app/files'
    autoload :Filter,   'travis/web/app/filter'
    autoload :Terminal, 'travis/web/app/terminal'
    autoload :Version,  'travis/web/app/version'

    Rack.autoload :SSL,      'rack/ssl'
    Rack.autoload :Deflater, 'rack/deflater'

    include Terminal

    attr_accessor :app

    def initialize
      config = Config.new
      announce(config)

      @app = Rack::Builder.app do
        use Rack::SSL if config.production?
        use Rack::Protection::PathTraversal
        use Rack::Deflater if config.deflate?

        # TODO this doesn't work, how can i extract this to a separate file/class
        # use Travis::Web::App::Api, config if config.run_api?
        if config.run_api?
          require 'travis/api/app'
          map config.api_endpoint do
            run Travis::Api::App.new
          end
        end

        use Travis::Web::App::Version, config
        use Travis::Web::App::Filter, config
        run Travis::Web::App::Files.new
      end
    end

    def call(env)
      app.call(env)
    end
  end
end
