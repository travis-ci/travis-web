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
end
