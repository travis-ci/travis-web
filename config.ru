require 'travis'
require 'travis/api/app'

env, api_endpoint, client_endpoint, run_api, watch = ENV.values_at('RACK_ENV', 'API_ENDPOINT', 'CLIENT_ENDPOINT', 'RUN_API', 'WATCH', 'DEFLATE')

env             ||= "development"
api_endpoint    ||= "https://api.#{Travis.config.host}" if env == "production"
run_api         ||= ["development", "test"].include? env
api_endpoint    ||= "/api" if run_api and run_api != '0'
client_endpoint ||= "/"
watch           ||= false #env == "development"
deflate         ||= env == "production"

c = proc do |value|
  case value
  when nil, false, '0' then "\e[31m0\e[0m"
  when true, '1'       then "\e[32m1\e[0m"
  else "\e[33m\"#{value}\"\e[0m"
  end
end

$stderr.puts "RACK_ENV         = #{c[env]}",
  "API_ENDPOINT     = #{c[api_endpoint]}",
  "CLIENT_ENDPOINT  = #{c[client_endpoint]}",
  "RUN_API          = #{c[run_api]}",
  "WATCH            = #{c[watch]}",
  "DEFLATE          = #{c[deflate]}"

class EndpointSetter < Struct.new(:app, :endpoint)
  DEFAULT_ENDPOINT = 'https://api.travis-ci.org'

  def call(env)
    status, headers, body = app.call(env)
    if endpoint != DEFAULT_ENDPOINT and headers.any? { |k,v| k.downcase == 'content-type' and v.start_with? 'text/html' }
      headers.delete 'Content-Length'
      body, old = [], body
      old.each { |s| body << s.gsub(DEFAULT_ENDPOINT, endpoint) }
      old.close if old.respond_to? :close
    end
    [status, headers, body]
  end
end

use Rack::SSL      if env == 'production'
use Rack::Deflater if deflate and deflate != '0'

app = proc do |env|
  Rack::File.new(nil).tap { |f| f.path = 'public/index.html' }.serving(env)
end

if run_api and run_api != '0'
  map api_endpoint.gsub(/:\d+/, '') do
    run Travis::Api::App.new
  end
end

map client_endpoint do
  use EndpointSetter, api_endpoint

  if watch and watch != '0'
    require 'rake-pipeline'
    require 'rake-pipeline/middleware'
    use Rake::Pipeline::Middleware, 'AssetFile'
    run app
  else
    run Rack::Cascade.new([Rack::File.new('public'), app])
  end
end
