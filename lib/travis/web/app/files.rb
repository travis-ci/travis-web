class Travis::Web::App
  class Files < Rack::Cascade
    MUST_REVALIDATE = %w(/ /index.html /version)

    def self.last_modified
      @last_modified ||= File.mtime("public/version").httpdate
    end

    def initialize
      super([public_dir, index])
    end

    def public_dir
      Rack::File.new('public')
    end

    def index
      proc do |env|
        status, headers, body = Rack::File.new(nil).tap { |f| f.path = 'public/index.html' }.serving(env)
        headers.merge!(cache_headers(env['PATH_INFO'])) # TODO unless development?
        [status, headers, body]
      end
    end

    def cache_headers(path)
      { 'Cache-Control' => cache_control(path), 'Last-Modified' => self.class.last_modified }
    end

    def cache_control(path)
      must_revalidate?(path) ? 'public, must-revalidate' : 'public, max-age=31536000'
    end

    def must_revalidate?(path)
      MUST_REVALIDATE.include?(path)
    end
  end
end
