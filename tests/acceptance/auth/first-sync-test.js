import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/first-sync';
import { run } from '@ember/runloop';

moduleForAcceptance('Acceptance | auth/first sync', {
  beforeEach() {
    this.currentUser = server.create('user', { is_syncing: true, synced_at: null });
    signInUser(this.currentUser);
  }
});

test('first sync shows up and redirects to profile page after the sync is finished', function (assert) {
  visit('/');
  andThen(() => {
    assert.equal(page.heading, 'One more thing');
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
