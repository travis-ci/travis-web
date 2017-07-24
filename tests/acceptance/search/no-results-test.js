import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | search/no results');

test('visiting /search/no-results', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

  visit('/search/no-results');

  andThen(function () {
    assert.equal(currentURL(), '/search/no-results');
    assert.equal(sidebarPage.missingReposMessage, 'No repositories found', 'Shows no search results message');
  });
});
