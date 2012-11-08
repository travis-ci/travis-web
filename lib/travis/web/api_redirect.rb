require 'sinatra'

class Travis::Web::ApiRedirect < Sinatra::Base
  disable :protection, :static
  set api_endpoint: 'https://api.travis-ci.org'

  set :api_types, %w[
    application/vnd.travis-ci.1+json
    application/vnd.travis-ci.1+xml
    application/vnd.travis-ci.1+png
    application/xml
    application/json
  ]

  set :frontend_types, %w[
    text/html application/xhtml+xml
  ]

  get '/:owner_name/:name.png' do
    redirect!
  end

  get '/:owner_name/:name/cc.xml' do
    redirect!
  end

  get '/:owner_name/:name/builds.json' do
    redirect! "/repos#{request.fullpath}"
  end

  after do
    redirect! if catch_all? and api_call?
  end

  private

    def catch_all?
      headers['Content-Location'] == '/' and request.path_info != '/'
    end

    def api_call?
      return true if request.accept.empty? or env['HTTP_ACCEPT'] == '*/*'
      preferred = request.preferred_type(*settings.frontend_types, *settings.api_types)
      settings.api_types.include? preferred
    end

    def redirect!(path = nil)
      path = File.join(settings.api_endpoint, path || request.fullpath)
      redirect(path, 301)
    end
end
