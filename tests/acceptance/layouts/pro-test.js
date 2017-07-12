import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proHeader from 'travis/tests/pages/header/pro';
import proLayout from 'travis/tests/pages/layouts/pro';

moduleForAcceptance('Acceptance | layouts/pro');

test('header layout when unauthenticated', function (assert) {
  withFeature('proVersion');

  proHeader.visit();

  andThen(function () {
    assert.ok(proLayout.headerWrapperWhenUnauthenticated, 'Header is wrapped within proper DOM');
    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks(0).title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks(1).title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks(2).title, 'Enterprise', 'Shows link to Enterprise offering');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
  });
});

test('header layout when authenticated', function (assert) {
  withFeature('proVersion');

  const currentUser = server.create('user');
  signInUser(currentUser);

  proHeader.visit();

  andThen(function () {
    assert.ok(proLayout.headerWrapperWhenAuthenticated, 'Header is wrapped within proper DOM');
    assert.ok(proHeader.logoPresent, 'Pro header has logo');
    assert.ok(proHeader.broadcastsPresent, 'Pro header shows broadcasts tower');
    assert.equal(proHeader.navigationLinks(0).title, 'Status', 'Shows link to Status');

    assert.equal(proHeader.navDropdowns(0).title, 'Help', 'Shows Help dropdown');
    assert.equal(proHeader.navDropdowns(0).childLinks(0).title, 'Email Support', 'Shows support link in Help dropdown');
    assert.equal(proHeader.navDropdowns(0).childLinks(1).title, 'Read Our Docs', 'Shows docs link in Help dropdown');
    assert.equal(proHeader.navDropdowns(0).childLinks(2).title, 'Twitter', 'Shows Twitter link in Help dropdown');

    assert.equal(proHeader.navDropdowns(1).title, 'Legal', 'Shows Legal dropdown');
    assert.equal(proHeader.navDropdowns(1).childLinks(0).title, 'Imprint', 'Shows Imprint link in Legal dropdown');
    assert.equal(proHeader.navDropdowns(1).childLinks(1).title, 'Security', 'Shows Security link in Legal dropdown');
    assert.equal(proHeader.navDropdowns(1).childLinks(2).title, 'Terms', 'Shows Terms link in Legal dropdown');

    assert.ok(proHeader.profileLinkPresent, 'Pro header shows profile links');
  });
});
