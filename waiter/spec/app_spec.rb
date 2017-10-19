require 'spec_helper'

describe Travis::Web::App do
  before do
    current_session.global_env['HTTP_ACCEPT'] = 'text/html,*/*'
  end

  describe 'catch all' do
    before  { get('/foo/bar') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/' }
    example { headers['Cache-Control'].should be == 'public, must-revalidate, max-age=0' }
    example { headers['Vary'].should include('Accept') }
  end

  describe 'assets' do
    before  { get('/favicon.ico') }
    example { last_response.should be_ok }
    example { headers['Content-Location'].should be == '/favicon.ico' }
    example { headers['Cache-Control'].should be == 'public, max-age=31536000, immutable' }
    example { headers['Vary'].split(',').should_not include('Accept') }
  end
end
