require 'rack'
require 'rack/ssl'
require 'delegate'
require 'time'

class Travis::Web::App
  # Simple Rack router that behaves like a hash.
  # Key is the path, value the response.
  class Router < DelegateClass(Hash)
    def initialize
      super({})
    end

    def call(env)
      self[env['PATH_INFO']]
    end
  end

  attr_reader :app, :router, :environment, :version, :last_modified, :age, :options, :root

  def initialize(options = {})
    @options       = options
    @environment   = options.fetch(:environment)
    @root          = options.fetch(:root)
    @router        = Router.new
    @app           = builder.to_app
    @version       = File.read File.expand_path('version', root)
    @last_modified = Time.now
    @age           = 60 * 60 * 24 * 365
    load_routes
  end

  def call(env)
    app.call(env)
  end

  private

    def load_routes
      each_file { |f| router[route_for(f)] = response_for(f) }
      router.default = router['/']
    end

    def response_for(file)
      content = File.read(file)
      set_config(content) if index? file

      headers = {
        'Content-Length'   => content.bytesize.to_s,
        'Content-Location' => route_for(file),
        'Cache-Control'    => cache_control(file),
        'Content-Location' => route_for(file),
        'Content-Type'     => mime_type(file),
        'ETag'             => version,
        'Last-Modified'    => last_modified.httpdate,
        'Expires'          => (last_modified + age).httpdate,
        'Vary'             => ''
      }

      [ 200, headers, [ content ] ]
    end

    def each_file
      Dir.chdir(root) do
        Dir.glob('**/*') { |f| yield f if File.file? f }
      end
    end

    def prefix?(file)
      file =~ /^(styles|scripts)\//
    end

    def index?(file)
       file == "index.html"
    end

    def route_for(file)
      file = File.join(version, file) if prefix? file
      file = "" if index? file
      "/#{file}"
    end

    def cache_control(file)
      case file
      when 'index.html' then "public, must-revalidate"
      when 'version'    then "no-cache"
      else "public, max-age=#{age}"
      end
    end

    def mime_type(file)
      Rack::Mime.mime_type File.extname(file)
    end

    def set_config(string)
      string.gsub! %r(<meta (rel|name)="(travis\.[^"]*)" (href|value)="([^"]*)"[^>]*>) do
        %(<meta #{$1}="#{$2}" #{$3}="#{options[$2.to_sym] || $4}">)
      end

      string.gsub! %r{(src|href)="(\/?)((styles|scripts)\/[^"]*)"} do
        %(#$1="#$2#{version}/#$3")
      end
    end

    def builder
      builder = Rack::Builder.new
      builder.use Rack::SSL if environment == 'production'
      builder.use Rack::Deflater
      builder.use Rack::Head
      builder.use Rack::ConditionalGet
      builder.run router
      builder
    end
end