import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | search/no results', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /search/no-results', async function (assert) {
    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await visit('/search/no-results');

    assert.equal(currentURL(), '/search/no-results');
    assert.equal(sidebarPage.missingReposMessage, 'No repositories found', 'Shows no search results message');
  });
});
