require 'lib/spec_helper'

describe Travis::Web::App::Config do
  let(:config) { Travis::Web::App::Config.new }

  before :each do
    @env = ENV.clone
    ENV.clear
  end

  after :each do
    ENV.replace(@env)
  end

  describe 'env' do
    it 'given ENV=foo it returns foo' do
      ENV['ENV'] = 'foo'
      config.env.should == 'foo'
    end

    it 'defaults to development' do
      config.env.should == 'development'
    end
  end

  describe 'run_api?' do
    it 'given RUN_API=1 it returns true' do
      ENV['RUN_API'] = '1'
      config.run_api?.should be_true
    end

    it 'given RUN_API=0 it returns false' do
      ENV['RUN_API'] = '0'
      config.run_api?.should be_false
    end

    it 'defaults to true if api_endpoint is local' do
      ENV['API_ENDPOINT'] = '/api'
      config.run_api?.should be_true
    end

    it 'defaults to false if api_endpoint is not local' do
      ENV['API_ENDPOINT'] = 'https://api.travis-ci.com'
      config.run_api?.should be_false
    end
  end

  describe 'api_endpoint' do
    it 'given API_ENDPOINT=https://api.travis-ci.com it returns the given url' do
      ENV['API_ENDPOINT'] = 'https://api.travis-ci.com'
      config.api_endpoint.should == 'https://api.travis-ci.com'
    end

    it 'defaults to /api if run_api? is true' do
      config.stubs(:run_api?).returns(true)
      config.api_endpoint.should == '/api'
    end

    it 'defaults to https://api.travis-ci.org if run_api? is false' do
      config.stubs(:run_api?).returns(false)
      config.api_endpoint.should == 'https://api.travis-ci.org'
    end
  end

  describe 'client_endpoint' do
    it 'given CLIENT_ENDPOINT=/client it returns the given url' do
      ENV['CLIENT_ENDPOINT'] = '/client'
      config.client_endpoint.should == '/client'
    end

    it 'defaults to /' do
      config.client_endpoint.should == '/'
    end
  end

  describe 'deflate?' do
    it 'given DEFLATE=1 it returns true' do
      ENV['DEFLATE'] = '1'
      config.deflate.should be_true
    end

    it 'given DEFLATE=0 it returns false' do
      ENV['DEFLATE'] = '0'
      config.deflate.should be_false
    end

    it 'defaults to true if env is production' do
      config.stubs(:env).returns('production')
      config.deflate.should be_true
    end

    it 'defaults to false if env is not production' do
      config.stubs(:env).returns('development')
      config.deflate.should be_false
    end
  end

  describe 'watch?' do
    it 'given WATCH=1 it returns true' do
      ENV['WATCH'] = '1'
      config.watch?.should be_true
    end

    it 'given WATCH=0 it returns false' do
      ENV['WATCH'] = '0'
      config.watch?.should be_false
    end

    it 'defaults to false' do
      config.watch?.should be_false
    end
  end
end
