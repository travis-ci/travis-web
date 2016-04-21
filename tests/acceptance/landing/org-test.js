import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import orgLandingPage from 'travis/tests/pages/landing-org';

moduleForAcceptance('Acceptance | org landing page test');

test('view landing page when unauthenticated', function(assert) {
  orgLandingPage
    .visit();

  andThen(function() {
    assert.equal(orgLandingPage.headerLinks(0).linkText, 'Blog', 'displays blog link');
    assert.equal(orgLandingPage.headerLinks(1).linkText, 'Docs', 'displays docs link');
    assert.equal(orgLandingPage.helpLink, 'Help', 'displays help dropdown');
    assert.equal(orgLandingPage.heroText, 'Test and Deploy with Confidence');
  });
});
