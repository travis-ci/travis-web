import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proHeader from 'travis/tests/pages/header/pro';
import proLayout from 'travis/tests/pages/layouts/pro';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | layouts/pro');

test('header layout when unauthenticated', function (assert) {
  withFeature('proVersion');

  proHeader.visit();

  andThen(function () {
    assert.ok(proLayout.headerWrapperWhenUnauthenticated, 'Header is wrapped within proper DOM');
    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks[0].title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks[1].title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks[2].title, 'Enterprise', 'Shows link to Enterprise offering');

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
    assert.equal(proHeader.navigationLinks[0].title, 'Changelog', 'Shows link to changelog');
    assert.equal(proHeader.navigationLinks[1].title, 'Documentation', 'Shows link to documentation');

    assert.ok(proHeader.profileLinkPresent, 'Pro header shows profile links');
  });
});
