require 'spec_helper'

describe Travis::Web::App do
  before do
    current_session.global_env['HTTP_ACCEPT'] = 'text/html,*/*'
  end

  describe 'catch all' do
    before { get('/foo/bar') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/' }
    example { headers['Cache-Control'].should include('must-revalidate') }
    example { headers['Cache-Control'].should include('public') }
    example { headers['Vary'].should include('Accept') }
  end

  describe 'assets' do
    before { get('/favicon.ico') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/favicon.ico' }
    example { headers['Cache-Control'].should_not include('must-revalidate') }
    example { headers['Cache-Control'].should include('public') }
    example { headers['Vary'].split(',').should_not include('Accept') }
  end

  describe 'version' do
    before { get('/version') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/version' }
    example { headers['Cache-Control'].should be == 'no-cache' }
    example { headers['Vary'].split(',').should_not include('Accept') }
  end

  describe 'custom branch' do
    context 'when passing custom branch as a param' do
      before { get('/?custom-branch=foo') }
      example { last_response.should be_ok }
      example { last_response.body.should include('/assets/foo/styles/app.css') }
      example { last_response.body.should include('/assets/foo/scripts/app.js') }
      example { headers['Set-Cookie'].should include('custom_branch=foo') }
    end

    context 'disabling custom branch' do
      before { get('/?disable-custom-branch=true') }
      example { last_response.should be_ok }
      example { last_response.body.should =~ %r{src="/[^\/]+/scripts/app.js} }
      example { last_response.body.should_not include('/assets/true/styles/app.css') }
      example { last_response.body.should_not include('/assets/foo/styles/app.css') }
      example { last_response.body.should_not include('/assets/foo/scripts/app.js') }
      example { headers['Set-Cookie'].should include('custom_branch=;') }
    end
  end
end
