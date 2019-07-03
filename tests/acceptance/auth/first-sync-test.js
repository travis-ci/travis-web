import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | auth/first sync', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.currentUser = server.create('user', 'syncing');
    signInUser(this.currentUser);
  });

  test('first sync shows up and redirects to profile page after the sync is finished', async function (assert) {
    await visit('/');
    assert.dom('[data-test-first-sync-notice-title]').hasText('One more thing');
    run(() => {
      this.currentUser.is_syncing = false;
      this.currentUser.save();
    });
    let done = assert.async();

    setTimeout(() => {
      done();
      assert.equal(currentURL(), '/account/repositories');
    }, 100);
  });
});
