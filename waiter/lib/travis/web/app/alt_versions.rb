# frozen_string_literal: true

class Travis::Web::App::AltVersions
  attr_reader :app

  def initialize(app)
    @app = app
  end

  def call(env)
    alt = alt_from_params(env) || alt_from_cookie(env)
    env['travis.alt'] = alt if alt && alt != 'default'
    status, headers, body = app.call(env)
    headers['Set-Cookie'] = cookie(alt) if alt
    [status, headers, body]
  end

  private

  def cookie(alt)
    "alt=#{alt == 'default' ? '' : alt}; path=/; max-age=#{alt == 'default' ? 0 : 86_400}"
  end

  def alt_from_params(env)
    ::Regexp.last_match(1) if env['QUERY_STRING'] =~ /alt=([^&]+)/
  end

  def alt_from_cookie(env)
    ::Regexp.last_match(1) if env['HTTP_COOKIE'] =~ /alt=([^;]+)/
  end
end
