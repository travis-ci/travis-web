import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proLandingPage from 'travis/tests/pages/landing-pro';

moduleForAcceptance('Acceptance | pro landing page test');

test('view landing page when unauthenticated', function(assert) {
  withFeature('pro');

  proLandingPage
    .visit();

  andThen(function() {
    assert.equal(proLandingPage.headerLinks(0).linkText, 'About Us', 'displays about us link');
    assert.equal(proLandingPage.headerLinks(1).linkText, 'Plans & Pricing', 'displays pricing links');
    assert.equal(proLandingPage.headerLinks(2).linkText, 'Enterprise', 'displays enterprise links');
    assert.equal(proLandingPage.heroText, 'Build apps with confidence');
  });
});
