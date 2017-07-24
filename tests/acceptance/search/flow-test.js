import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | search/flow');

test('searching from index page transitions to search page', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

  server.create('repository');

  sidebarPage
    .visit()
    .enterSearchQuery('foo')
    .pressEnter();

  andThen(() => {});

  andThen(function () {
    assert.equal(currentURL(), '/search/foo');
  });
});

test('searching while unauthenticated redirects to landing page', function (assert) {
  visit('/search/foo');

  andThen(() => {
    assert.equal(currentURL(), '/');
  });
});
