require 'sinatra/base'

app = Sinatra.new do
  configure do
    disable :protection
    set :root, File.dirname(__FILE__)
    set :public_folder, lambda { "#{root}/public" }
    set :static_cache_control, :public
  end

  configure :test, :development do
    set :endpoint, '/api'
  end

  configure :production do
    require 'travis'
    set :endpoint, "https://api.#{Travis.config.host}"
  end

  get '*', provides: :html do
    cache_control settings.static_cache_control
    File.read('public/index.html').gsub('https://api.travis-ci.org', settings.endpoint)
  end

  not_found do
    'Not found.'
  end
end

use Rack::Deflater

if app.development?
  require 'travis/api/app'
  map(app.endpoint) { run Travis::Api::App.new }
  map('/') { run app.new }
else
  run app.new
end
