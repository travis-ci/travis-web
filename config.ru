$: << 'lib'

require 'sinatra'

class App < Sinatra::Base
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

