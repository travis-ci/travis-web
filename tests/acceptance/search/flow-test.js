import { settled, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';
import signOutUser from 'travis/tests/helpers/sign-out-user';

module('Acceptance | search/flow', function (hooks) {
  setupApplicationTest(hooks);

  test('searching from index page transitions to search page', async function (assert) {
    const currentUser = server.create('user');
    signInUser(currentUser);

    server.create('repository');

    await sidebarPage
      .visit()
      .enterSearchQuery('foo')
      .pressEnter();

    await settled();
    assert.equal(currentURL(), '/search/foo');
  });

  test('searching while unauthenticated redirects to landing page', async function (assert) {
    const currentUser = server.create('user');
    signOutUser(currentUser);
    await visit('/search/foo');

    assert.equal(currentURL(), '/');
  });
});
