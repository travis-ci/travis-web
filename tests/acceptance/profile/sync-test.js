import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | profile/sync', {
  beforeEach() {
    let twoYearsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 2);

    this.user = server.create('user', {
      name: 'Miss Major',
      login: 'miss-major',
      synced_at: twoYearsAgo
    });

    signInUser(this.user);
  }
});

test('trigger sync', function (assert) {
  let done = assert.async();

  profilePage.visit({ username: 'miss-major' });

  andThen(() => {
    assert.equal(profilePage.syncButton.lastSynced, 'Last synced 2 years ago');
    assert.equal(profilePage.syncButton.text, 'Sync account');
  });

  let syncCalled = false;

  server.post(`/user/${this.user.id}/sync`, () => {
    this.user.is_syncing = true;
    this.user.save();
    syncCalled = true;
  });

  profilePage.syncButton.click();

  andThen(() => {
    assert.equal(profilePage.syncButton.text, 'Syncing from GitHub');
    assert.ok(syncCalled, 'expected sync endpoint to have been posted to');

    this.user.is_syncing = false;
    this.user.synced_at = new Date();
    this.user.save();
  });

  andThen(() => {
    setTimeout(() => {
      assert.equal(profilePage.syncButton.text, 'Sync account');
      assert.equal(profilePage.syncButton.lastSynced, 'Last synced less than a minute ago');

      done();
    }, config.intervals.syncingPolling);
  });
});
