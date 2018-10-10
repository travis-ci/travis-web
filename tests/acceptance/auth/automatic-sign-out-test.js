import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | automatic sign out', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('when token is invalid user should be signed out', function (assert) {
  window.sessionStorage.setItem('travis.token', 'wrong-token');
  window.localStorage.setItem('travis.token', 'wrong-token');

  visit('/account');

  andThen(function () {
    assert.equal(topPage.flashMessage.text, "You've been signed out, because your access token has expired.");
    assert.equal(currentURL(), '/');
  });
  percySnapshot(assert);
});
