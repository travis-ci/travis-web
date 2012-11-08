require 'spec_helper'

describe Travis::Web::ApiRedirect do
  let(:browser_accept) { 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }

  it 'does not redirect normal requests' do
    get('/').should_not be_redirect
  end

  it 'redirects /:owner/:repo.png' do
    get('/foo/bar.png').should be_redirect
  end

  it 'does not redirect catch-all for browsers' do
    get('/foo/bar', {}, 'HTTP_ACCEPT' => browser_accept).should_not be_redirect
  end

  it 'does not redirect catch-all with generic Accept header' do
    get('/foo/bar', {}, 'HTTP_ACCEPT' => '*/*').should be_redirect
  end

  it 'redirects catch-all without Accept header' do
    get('/foo/bar').should be_redirect
  end

  it 'redirects catch-all JSON requests' do
    get('/foo/bar', {}, 'HTTP_ACCEPT' => 'application/json').should be_redirect
  end

  it 'does not redirect asset requests' do
    get('/version').should_not be_redirect
  end
end
