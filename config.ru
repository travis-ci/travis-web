# Make sure we set that before everything
ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] || ENV['ENV']
ENV['RAILS_ENV']  = ENV['RACK_ENV']

$: << 'lib'
require 'travis/web'

class RedirectSubdomain < Struct.new(:app, :from)
  def call(env)
    request = Rack::Request.new(env)
    if request.host == from
      [301, { 'Location' => "https://travis-ci.org#{request.fullpath}", 'Content-Type' => 'text/html' }, []]
    else
      app.call(env)
    end
  end
end

use RedirectSubdomain, 'secure.travis-ci.org'
use Rack::MobileDetect, :redirect_to => ENV['MOBILE_ENDPOINT'] if ENV['MOBILE_ENDPOINT']

use Travis::Web::SetToken
use Travis::Web::Allow
use Travis::Web::ApiRedirect do |app|
  app.settings.api_endpoint = ENV['API_ENDPOINT'] if ENV['API_ENDPOINT']
end

run Travis::Web::App.build(
  environment:  ENV['RACK_ENV'] || 'development',
  api_endpoint: ENV['API_ENDPOINT'],
  pusher_key:   ENV['PUSHER_KEY'],
  ga_code:      ENV['GA_CODE'],
  root:         File.expand_path('../public', __FILE__)
)
