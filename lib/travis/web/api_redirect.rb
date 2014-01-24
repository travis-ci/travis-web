require 'sinatra'

class Travis::Web::ApiRedirect < Sinatra::Base
  disable :protection, :static
  set api_endpoint: 'https://api.travis-ci.org'

  get '/:owner_name/:name.png' do
    redirect!
  end

  get '/:owner_name/:name/cc.xml' do
    redirect!
  end

  private

    def redirect!(path = nil)
      path = File.join(settings.api_endpoint, path || request.fullpath)
      redirect(path, 301)
    end
end
