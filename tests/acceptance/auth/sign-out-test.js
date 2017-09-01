import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | auth/sign out', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('signing out clears flash messages', function (assert) {
  visit('/');
  this.application.__container__.lookup('service:flashes').success('TOTAL SUCCESS');
  topPage.clickSigOutLink();

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.ok(topPage.flashMessage.isHidden, 'Does not display a flash message');
  });
});
