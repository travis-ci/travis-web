require 'spec_helper'

describe Travis::Web::App do
  before do
    current_session.global_env['HTTP_ACCEPT'] = 'text/html,*/*'
  end

  describe 'catch all' do
    before  { get('/foo/bar') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/' }
    example { headers['Cache-Control'].should include('must-revalidate') }
    example { headers['Cache-Control'].should include('public') }
    example { headers['Vary'].should include('Accept') }
  end

  describe 'assets' do
    before  { get('/favicon.ico') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/favicon.ico' }
    example { headers['Cache-Control'].should_not include('must-revalidate') }
    example { headers['Cache-Control'].should include('public') }
    example { headers['Vary'].split(',').should_not include('Accept') }
  end

  describe 'version' do
    before  { get('/version') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/version' }
    example { headers['Cache-Control'].should be == 'no-cache' }
    example { headers['Vary'].split(',').should_not include('Accept') }
  end

  describe 'alternate asset versions' do
    context 'not passing an alt param' do
      before  { get('/') }
      example { headers['Set-Cookie'].should be_nil }
    end

    context 'passing an alt param' do
      before  { get('/?alt=foo') }
      example { last_response.should be_ok }
      example { last_response.body.should include('/assets/foo/styles/app.css') }
      example { last_response.body.should include('/assets/foo/scripts/app.js') }
      example { headers['Set-Cookie'].should == 'alt=foo; Max-Age=86400' }
    end

    context 'passing default as an alt param' do
      before  { get('/?alt=default') }
      example { headers['Set-Cookie'].should == 'alt=default; Max-Age=0' }
    end
  end
end
