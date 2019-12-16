import { currentURL, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { run } from '@ember/runloop';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | auth/first sync', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', 'syncing');
    signInUser(this.currentUser);
  });

  skip('first sync shows up and redirects to profile page after the sync is finished', async function (assert) {
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
