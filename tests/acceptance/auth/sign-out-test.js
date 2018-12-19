import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | auth/sign out', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('signing out clears flash messages', async function (assert) {
    await visit('/');
    this.owner.lookup('service:flashes').success('TOTAL SUCCESS');
    await topPage.clickSignOutLink();

    assert.equal(currentURL(), '/');
    assert.ok(topPage.flashMessage.isHidden, 'Does not display a flash message');
  });
});
