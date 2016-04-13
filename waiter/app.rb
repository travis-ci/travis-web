require 'sinatra'
require 'redis'

get '/' do
  content_type 'text/html'

  redis = Redis.new
  project = 'travis'
  index_key = params[:index_key] || redis.get("#{project}:index:current")
  redis.get("#{project}:index:#{index_key}")
end
