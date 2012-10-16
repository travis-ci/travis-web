# Make sure we set that before everything
ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] || ENV['ENV']
ENV['RAILS_ENV']  = ENV['RACK_ENV']

$: << 'lib'
require 'travis/web'
run Travis::Web::App.new(
  environment:  ENV['RACK_ENV'] || 'development',
  api_endpoint: ENV['API_ENDPOINT'],
  pusher_key:   ENV['PUSHER_KEY'],
  root:         File.expand_path('../public', __FILE__)
)
