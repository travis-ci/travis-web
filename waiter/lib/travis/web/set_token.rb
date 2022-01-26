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
        set_info(env) || app.call(env)
      end

      def set_info(env)
        return unless env['REQUEST_METHOD'] == 'POST'
        request = Rack::Request.new(env)
        token, user, storage = request.params.values_at('token', 'user', 'storage')
        puts '--------cc'
        puts token
        puts '-------ccc'
        puts user
        if token =~ /\A[a-zA-Z\-_\d]+\Z/
          storage = 'sessionStorage' if storage != 'localStorage'
          info = [storage, token, user, request.fullpath]
          puts '------cccc'
          puts info
          puts '-----ccccc'
          puts template % info
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
storage['travis-logs'] += ' | user set in set_token'
storage.setItem('travis.user2', storage['travis.user']);
storage.setItem('travis.become', true);
window.location = %p;
</script>
