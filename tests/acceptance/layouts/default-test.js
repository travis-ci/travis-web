import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import defaultHeader from 'travis/tests/pages/header/default';
import defaultLayout from 'travis/tests/pages/layouts/default';
import signInUser from 'travis/tests/helpers/sign-in-user';
import signOutUser from 'travis/tests/helpers/sign-out-user';

module('Acceptance | layouts/default', function (hooks) {
  setupApplicationTest(hooks);

  test('header layout when unauthenticated', async function (assert) {
    const currentUser = server.create('user');
    signOutUser(currentUser);

    await defaultHeader.visit();

    assert.ok(defaultLayout.headerWrapperWhenUnauthenticated, 'Header is wrapped within proper DOM');
    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.equal(defaultHeader.navigationLinks[0].title, 'About Us', 'Shows link to About Us');
    assert.equal(defaultHeader.navigationLinks[1].title, 'Blog', 'Shows link to Blog');
    assert.equal(defaultHeader.navigationLinks[2].title, 'Status', 'Shows link to Status');
    assert.equal(defaultHeader.navigationLinks[3].title, 'Documentation', 'Shows link to Documentation');

    assert.ok(defaultHeader.loginLinkPresent, 'Default header has login button');
  });

  test('header layout when authenticated', async function (assert) {
    const currentUser = server.create('user');
    signInUser(currentUser);

    await defaultHeader.visit();

    assert.ok(defaultLayout.headerWrapperWhenAuthenticated, 'Header is wrapped within proper DOM');
    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.ok(defaultHeader.broadcastsPresent, 'Default header shows broadcasts tower');
    assert.equal(defaultHeader.navigationLinks[0].title, 'Dashboard');
    assert.equal(defaultHeader.navigationLinks[1].title, 'Changelog', 'Shows link to changelog');
    assert.equal(defaultHeader.navigationLinks[2].title, 'Documentation', 'Shows link to documentation');
    assert.ok(defaultHeader.profileLinkPresent, 'Default header shows profile links');
  });
});
