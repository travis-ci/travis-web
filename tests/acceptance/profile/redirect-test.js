import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/redirect', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('visiting /profile redirects to /profile/:username', function (assert) {
  visit('/profile');

  andThen(() => {
    assert.equal(currentURL(), '/profile/testuser');
  });
});
