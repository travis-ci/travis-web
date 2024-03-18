# frozen_string_literal: true

# not used, doesn't seem to work
Travis::Web::App::MobileRedirect = Struct.new(:app) do
  def call(env)
    request = Rack::Request.new env

    if request.params['mobile'] || request.user_agent.to_s =~ /Mobile|webOS/
      location = "https://secure.travis-ci.org#{equest.fullpath}"
      [301, { 'Content-Type' => 'text/plain', 'Location' => location }, []]
    else
      app.call env
    end
  end
end
