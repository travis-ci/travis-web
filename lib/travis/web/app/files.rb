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
        Rack::File.new(nil).tap { |f| f.path = 'public/index.html' }.serving(env)
      end
    end
  end
end
