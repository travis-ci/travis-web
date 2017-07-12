import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | home/without repositories', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('signed in but without repositories', function (assert) {
  sidebarPage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/getting_started');
  });
  percySnapshot(assert);
});
