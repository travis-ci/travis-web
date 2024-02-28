# frozen_string_literal: true

require 'sinatra'

class Travis::Web::ApiRedirect < Sinatra::Base
  disable :protection, :static
  set api_endpoint: 'https://api.travis-ci.org'
  set redirect_png: ENV['REDIRECT_PNG']

  get %r{/([^/]+)/([^/]+)\.(png|svg)} do
    pass if %r{/images/}.match?(request.path_info)

    if settings.redirect_png
      redirect!(request.fullpath.gsub(/\.png$/, '.svg'))
    else
      redirect!
    end
  end

  get '/:owner_name/:name/cc.xml' do
    redirect!
  end

  private

  def public_image?
    params[:owner_name] == 'images'
  end

  def redirect!(path = nil)
    path = File.join(settings.api_endpoint, path || request.fullpath)
    redirect(path, 301)
  end
end
