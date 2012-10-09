class Travis::Web::App
  class Files < Rack::Cascade
    def initialize
      super([public_dir, index])
    end

    def public_dir
      Rack::File.new('public')
    end

    def index
      proc do |env|
        status, headers, body = Rack::File.new(nil).tap { |f| f.path = 'public/index.html' }.serving(env)
        headers.delete 'Last-Modified'
        [status, headers, body]
      end
    end
  end
end
