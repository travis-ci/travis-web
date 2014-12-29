# Make sure we set that before everything
ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] || ENV['ENV']
ENV['RAILS_ENV']  = ENV['RACK_ENV']

$: << 'lib'
require 'travis/web'

if ENV['TRAVIS_PRO']
  require 'travis/pro/web/redirect'
end

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

unless ENV['TRAVIS_PRO']
  use RedirectSubdomain, 'secure.travis-ci.org'
end

use Rack::MobileDetect, :redirect_to => ENV['MOBILE_ENDPOINT'] if ENV['MOBILE_ENDPOINT']

use Travis::Web::SetToken
use Travis::Web::Allow

use Travis::Web::ApiRedirect do |app|
  app.settings.api_endpoint = ENV['API_ENDPOINT'] if ENV['API_ENDPOINT']
end

run Travis::Web::App.build(
  environment:     ENV['RACK_ENV'] || 'development',
  api_endpoint:    ENV['API_ENDPOINT'],
  pages_endpoint:   ENV['PAGES_ENDPOINT'],
  billing_endpoint: ENV['BILLING_ENDPOINT'] || 'https://billing.travis-ci.com',
  source_endpoint: ENV['SOURCE_ENDPOINT'] || 'https://github.com',
  pusher_key:      ENV['PUSHER_KEY'],
  pusher_host:     ENV['PUSHER_HOST'] || 'ws.pusherapp.com',
  pusher_path:     ENV['PUSHER_PATH'],
  ga_code:         ENV['GA_CODE'],
  root:            File.expand_path('../public', __FILE__),
  server_start:    Time.now,
  caches_enabled:  ENV['CACHES_ENABLED'],
  ssh_key_enabled: ENV['SSH_KEY_ENABLED'],
  pusher_log_fallback:  ENV['PUSHER_LOG_FALLBACK'],
  charm_key:        ENV['CHARM_KEY'],
  customer_io_site_id: ENV['CUSTOMER_IO_SITE_ID'],
  pro: ENV['TRAVIS_PRO']
)
