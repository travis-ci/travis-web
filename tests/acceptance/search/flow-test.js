import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | search/flow', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  },
});

test('searching from index page transitions to search page', function (assert) {
  server.create('repository');

  sidebarPage
    .visit()
    .enterSearchQuery('foo')
    .pressEnter();

  andThen(function () {
    assert.equal(currentURL(), '/search/foo');
  });
});
