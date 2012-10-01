require 'rack'
require 'rack/protection/path_traversal'

module Travis::Web
  class App
    ASSET_DIRS = %r(/(stylesheets|javascripts)/)

    autoload :Api,      'travis/web/app/api'
    autoload :Assets,   'travis/web/app/assets'
    autoload :Config,   'travis/web/app/config'
    autoload :Files,    'travis/web/app/files'
    autoload :Helpers,  'travis/web/app/helpers'
    autoload :Filter,   'travis/web/app/filter'
    autoload :Terminal, 'travis/web/app/terminal'

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

        use Travis::Web::App::Api, config if config.run_api?
        use Travis::Web::App::Assets, config
        use Travis::Web::App::Filter, config
        run Travis::Web::App::Files.new
      end
    end

    def call(env)
      app.call(env)
    end
  end
end
