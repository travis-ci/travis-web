require 'rack/request'
require 'rack/response'

module Travis
  module Web
    class SetToken
      attr_accessor :app, :template

      def initialize(app)
        @app, @template = app, File.read(__FILE__).split('__END__').last
      end

      def call(env)
        return app.call(env) unless info = info_for(env)
        Rack::Response.new(template % info).finish
      end

      def info_for(env)
        return unless env['REQUEST_METHOD'] == 'POST'
        info = Rack::Request.new(env).params.values_at('token', 'user')
        info if info.first =~ /\A[a-zA-Z\-_\d]+\Z/
      end
    end
  end
end

__END__
<script>
sessionStorage.setItem('travis.token', %p);
sessionStorage.setItem('travis.user',  %p);
window.location = '/';
</script>
