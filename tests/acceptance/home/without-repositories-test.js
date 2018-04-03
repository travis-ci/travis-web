import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | home/without repositories', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('signed in but without repositories', function (assert) {
  sidebarPage.visit();

  // TODO: Remove this
  andThen(() => {});
  andThen(function () {
    assert.equal(currentURL(), '/getting_started');
  });
  percySnapshot(assert);
});
