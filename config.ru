$: << 'lib'

require 'sinatra'
require 'travis/api/app'

class App < Sinatra::Base
  use Travis::Api::App

  disable :protection

  set :root, File.dirname(__FILE__)
  set :public_folder, lambda { "#{root}/public" }
  set :static_cache_control, :public

  not_found do
    'Not found.'
  end
end

use Rack::Deflater
run App

