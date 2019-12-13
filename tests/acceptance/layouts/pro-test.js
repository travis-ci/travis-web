import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { visit } from '@ember/test-helpers';
import proHeader from 'travis/tests/pages/header/pro';
import proLayout from 'travis/tests/pages/layouts/pro';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | layouts/pro', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('header layout when unauthenticated', async function (assert) {
    enableFeature('proVersion');

    await visit('/');

    assert.ok(proLayout.headerWrapperWhenUnauthenticated, 'Header is wrapped within proper DOM');
    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks[0].title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks[1].title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks[2].title, 'Enterprise', 'Shows link to Enterprise offering');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
  });

  test('header layout when authenticated', async function (assert) {
    enableFeature('proVersion');

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await visit('/');

    assert.ok(proLayout.headerWrapperWhenAuthenticated, 'Header is wrapped within proper DOM');
    assert.ok(proHeader.logoPresent, 'Pro header has logo');
    assert.ok(proHeader.broadcastsPresent, 'Pro header shows broadcasts tower');
    assert.equal(proHeader.navigationLinks[0].title, 'Dashboard');
    assert.equal(proHeader.navigationLinks[1].title, 'Changelog', 'Shows link to changelog');
    assert.equal(proHeader.navigationLinks[2].title, 'Documentation', 'Shows link to documentation');

    assert.ok(proHeader.profileLinkPresent, 'Pro header shows profile links');
  });
});
