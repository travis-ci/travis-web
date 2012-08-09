$: << 'lib'

require 'sinatra'
require 'travis/api/app'

class App < Sinatra::Base
  disable :protection

  set :root, File.dirname(__FILE__)
  set :public_folder, lambda { "#{root}/public" }
  set :static_cache_control, :public

  provides :html

  get '*' do
    File.new('public/index.html').readlines
  end

  not_found do
    'Not found.'
  end
end

use Rack::Deflater
run Rack::Cascade.new([App, Travis::Api::App])

