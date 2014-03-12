require 'spec_helper'

describe Travis::Web::ApiRedirect do
  let(:browser_accept) { 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }

  it 'does not redirect normal requests' do
    get('/').should_not be_redirect
  end

  it 'redirects /:owner/:repo.png' do
    get('/foo/bar.png').should be_redirect
  end

  it 'does not redirect /owner/some-png-repo' do
    get('/owner/some-png-repo').should_not be_redirect
  end
end
