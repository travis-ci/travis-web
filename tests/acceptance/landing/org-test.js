import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import orgLandingPage from 'travis/tests/pages/landing-org';

moduleForAcceptance('Acceptance | org landing page test');

test('view langding page when unauthenticated', function(assert) {
  orgLandingPage
    .visit();

  andThen(function() {
    assert.equal(orgLandingPage.heroText, 'Test and Deploy with Confidence');
  });
});
