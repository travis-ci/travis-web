import { settled, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | search/flow', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('searching from index page transitions to search page', async function (assert) {
    const currentUser = this.server.create('user');
    signInUser(currentUser);

    this.server.create('repository');

    await sidebarPage
      .visit()
      .enterSearchQuery('foo')
      .pressEnter();

    await settled();
    assert.equal(currentURL(), '/search/foo');
  });

  test('searching while unauthenticated redirects to landing page', async function (assert) {
    await visit('/search/foo');

    assert.equal(currentURL(), '/');
  });
});
