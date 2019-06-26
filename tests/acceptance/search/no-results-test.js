import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | search/no results', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /search/no-results', async function (assert) {
    const currentUser = server.create('user');
    signInUser(currentUser);

    await visit('/search/no-results');

    assert.equal(currentURL(), '/search/no-results');
    assert.equal(sidebarPage.missingReposMessage, 'No repositories found', 'Shows no search results message');
  });
});
