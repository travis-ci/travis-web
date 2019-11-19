require 'rack/request'
require 'rack/response'
require 'sanitize'

module Travis
  module Web
    class SetToken
      attr_accessor :app, :template

      def initialize(app)
        @app, @template = app, File.read(__FILE__).split('__END__').last
      end

      def call(env)
        set_info(env) || app.call(env)
      end

      def set_info(env)
        return unless env['REQUEST_METHOD'] == 'POST'
        request = Rack::Request.new(env)
        token, user, storage, become = request.params.values_at('token', 'user', 'storage', 'become')
        if token =~ /\A[a-zA-Z\-_\d]+\Z/
          storage = 'sessionStorage' if storage != 'localStorage'
          become = become ? true : false
          info = [
            storage,
            Sanitize.fragment(token),
            Sanitize.fragment(user),
            become,
            request.fullpath
          ]
          Rack::Response.new(template % info).finish
        end
      end
    end
  end
end

__END__
<script>
var storage = %s;
storage.setItem('travis.token', %p);
storage.setItem('travis.user',  %p);
if (%p) {
  storage.setItem('travis.auth.become', true);
}
storage.setItem('travis.auth.updatedAt', Date.now());
window.location.href = %p;
</script>
