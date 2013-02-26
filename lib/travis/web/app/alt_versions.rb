class Travis::Web::App::AltVersions
  attr_reader :app

  def initialize(app)
    @app = app
  end

  def call(env)
    alt = alt_from_params(env) || alt_from_cookie(env)
    env['travis.alt'] = alt if alt
    status, headers, body = app.call(env)
    headers['Set-Cookie'] = "alt=#{alt}; path=/; Secure" if alt
    [status, headers, body]
  end

  private

    def alt_from_params(env)
      alt_from_string env['QUERY_STRING']
    end

    def alt_from_cookie(env)
      alt_from_string env['HTTP_COOKIE']
    end

    def alt_from_string(string)
      $1 if string =~ /alt=([^&]*)/
    end
end
