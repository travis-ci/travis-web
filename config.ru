# Make sure we set that before everything
ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] || ENV['ENV']
ENV['RAILS_ENV']  = ENV['RACK_ENV']

$: << 'lib'
require 'travis/web'

use Travis::Web::SetToken
use Travis::Web::Allow
use Travis::Web::ApiRedirect do |app|
  app.settings.api_endpoint = ENV['API_ENDPOINT'] if ENV['API_ENDPOINT']
end

run Travis::Web::App.new(
  environment:  ENV['RACK_ENV'] || 'development',
  api_endpoint: ENV['API_ENDPOINT'],
  pusher_key:   ENV['PUSHER_KEY'],
  root:         File.expand_path('../public', __FILE__)
)
