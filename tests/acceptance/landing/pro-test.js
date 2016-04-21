import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proLandingPage from 'travis/tests/pages/landing-pro';

moduleForAcceptance('Acceptance | pro landing page test');

test('view landing page when unauthenticated', function(assert) {
  withFeature('pro');

  proLandingPage
    .visit();

  andThen(function() {
    assert.equal(proLandingPage.heroText, 'Build apps with confidence');
  });
});
