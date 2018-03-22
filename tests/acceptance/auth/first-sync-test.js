import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { run } from '@ember/runloop';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | auth/first sync', {
  beforeEach() {
    this.currentUser = server.create('user', { is_syncing: true, synced_at: null });
    signInUser(this.currentUser);
  }
});

test('first sync shows up and redirects to profile page after the sync is finished', function (assert) {
  visit('/');
  andThen(() => {
    assert.dom('[data-test-first-sync-notice-title]').hasText('One more thing');
    run(() => {
      this.currentUser.is_syncing = false;
      this.currentUser.save();
    });
  });

  andThen(() => {
    let done = assert.async();

    setTimeout(() => {
      done();
      andThen(() => {
        assert.equal(currentURL(), '/profile/testuser');
      });
    }, 100);
  });
});
