import { module, skip } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { waitFor } from '@ember/test-helpers';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

async function finishSyncingUser(user) {
  user.is_syncing = false;
  user.synced_at = new Date();
  await user.save();
}

module('Acceptance | profile/sync', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    let twoYearsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 2);

    this.user = this.server.create('user', {
      name: 'Miss Major',
      login: 'miss-major',
      synced_at: twoYearsAgo
    });

    signInUser(this.user);
  });

  skip('trigger sync', async function (assert) {
    await profilePage.visit();

    assert.equal(profilePage.syncButton.lastSynced, 'Last synced 2 years ago');
    assert.equal(profilePage.syncButton.text, 'Sync account');

    let syncCalled = false;

    this.server.post(`/user/${this.user.id}/sync`, () => {
      this.user.is_syncing = true;
      syncCalled = true;
      return this.user.save();
    });

    await profilePage.syncButton.click();

    assert.equal(profilePage.syncButton.text, 'Syncing from GitHub');
    assert.ok(syncCalled, 'expected sync endpoint to have been posted to');

    await finishSyncingUser(this.user);
    await waitFor('[data-test-start-sync-button]');

    assert.equal(profilePage.syncButton.text, 'Sync account');
    assert.equal(profilePage.syncButton.lastSynced, 'Last synced less than a minute ago');
  });
});
