# not used, doesn't seem to work
class Travis::Web::App::MobileRedirect < Struct.new(:app)
  def call(env)
    request = Rack::Request.new env

    if request.params['mobile'] || request.user_agent.to_s =~ /Mobile|webOS/
      location = 'https://secure.travis-ci.org' + request.fullpath
      [301, { 'Content-Type' => 'text/plain', 'Location' => location }, []]
    else
      app.call env
    end
  end
end
