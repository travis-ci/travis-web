require 'spec_helper'

# disabled, we now use Rack::MobileDetect
#
# describe Travis::Web::App::MobileRedirect do
#
#   describe 'with mobile client' do
#     let(:agent) { 'blah blah Mobile blablah' }
#
#     it 'redirects to secure.travis-ci.org' do
#       get('/foo/bar?baz', {}, 'HTTP_USER_AGENT' => agent).should be_redirect
#       last_response.headers['Location'].should == 'https://secure.travis-ci.org/foo/bar?baz'
#     end
#   end
#
#   describe 'with mobile param' do
#     it 'redirects to secure.travis-ci.org' do
#       get('/foo/bar?baz', mobile: true).should be_redirect
#       last_response.headers['Location'].should == 'https://secure.travis-ci.org/foo/bar?mobile=true&baz'
#     end
#   end
# end
