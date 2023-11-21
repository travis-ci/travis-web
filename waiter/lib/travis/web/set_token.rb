# frozen_string_literal: true

require 'rack/request'
require 'rack/response'
require 'sanitize'

module Travis
  module Web
    class SetToken
      attr_accessor :app, :template

      def initialize(app)
        @app = app
        @template = File.read(__FILE__).split('__END__').last
      end

      def call(env)
        set_info(env) || app.call(env)
      end

      def set_info(env) # rubocop:disable Naming/AccessorMethodName
        return unless env['REQUEST_METHOD'] == 'POST'

        request = Rack::Request.new(env)
        puts "WHAT"
        puts  request.params
        token, rss_token, user, storage, become = request.params.values_at('token', 'rssToken', 'user', 'storage',
                                                                           'become')
        if /\A[a-zA-Z\-_\d]+\Z/.match?(token)
          storage = 'sessionStorage' if storage != 'localStorage'
          become = become ? true : false
          info = [
            storage,
            Sanitize.fragment(token),
            Sanitize.fragment(rss_token),
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
storage.setItem('travis.rssToken', %p);
storage.setItem('travis.user',  %p);
if (%p) {
  storage.setItem('travis.auth.become', true);
}
storage.setItem('travis.auth.updatedAt', Date.now());
window.location.href = %p;
</script>
