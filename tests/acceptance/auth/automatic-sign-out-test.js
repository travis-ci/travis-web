/* global signInUser */
import { skip } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import authPage from 'travis/tests/pages/auth';

moduleForAcceptance('Acceptance | automatic sign out', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

skip('when token is invalid user should be signed out', function (assert) {
  window.sessionStorage.setItem('travis.token', 'wrong-token');
  window.localStorage.setItem('travis.token', 'wrong-token');

  visit('/');

  andThen(function () {
    assert.equal(authPage.automaticSignOutNotification, "You've been signed out, because your access token has expired.");
  });
  percySnapshot(assert);
});
