class Travis::Web::App::AltVersions
  attr_reader :app

  def initialize(app)
    @app = app
  end

  def call(env)
    alt = alt_from_params(env) || alt_from_cookie(env)
    env['travis.alt'] = alt if alt
    status, headers, body = app.call(env)
    headers['Set-Cookie'] = cookie(alt) if env.key?('travis.alt')
    [status, headers, body]
  end

  private

    def cookie(alt)
      "alt=#{alt}; Domain=staging.travis-ci.org; Secure; Max-Age=#{alt == 'default' ? 0 : 86400}"
    end

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
