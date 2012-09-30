# ENV['RACK_ENV'] = ENV['RAILS_ENV'] = ENV['ENV'] = 'test'

require 'rspec'
require 'travis/web'
require 'sinatra/test_helpers'

# require 'logger'
# require 'gh'
# require 'multi_json'

RSpec.configure do |config|
  config.mock_framework = :mocha
  config.expect_with :rspec, :stdlib
  # config.include TestHelpers

  # config.before :each do
  #   set_app Travis::Web::App.new
  # end
end
