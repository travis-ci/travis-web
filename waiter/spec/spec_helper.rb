# frozen_string_literal: true

ENV['RACK_ENV'] = 'test'

require 'sinatra/contrib'
require 'travis/web'

ru_file = File.expand_path('../config.ru', __dir__)
web_app = Rack::Builder.parse_file(ru_file).first

RSpec.configure do |config|
  config.expect_with :rspec
  config.include Sinatra::TestHelpers
  config.before(:each) { set_app(web_app) }
end
