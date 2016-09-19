import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';

moduleForAcceptance('Acceptance | home/without repositories', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('signed in but without repositories', function (assert) {
  dashboardPage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/getting_started');
  });
  percySnapshot(assert);
});
