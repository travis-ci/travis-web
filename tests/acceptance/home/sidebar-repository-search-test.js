import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';

moduleForAcceptance('Acceptance | home/sidebar repository search', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });
  }
});

test('searching for a repository from dashboard', function (assert) {
  dashboardPage
    .visit()
    .search('foo')
    .trigger();

  andThen(() => {
    Ember.run.next(function () {
      assert.equal(currentURL(), '/search/foo');
    });
  });

  andThen(() => {
    assert.equal(dashboardPage.sidebarRepositories().count, 1, 'expected to see search result in sidebar');
  });
});

test('reloading a previous search', function (assert) {
  visit('/search/foo');

  andThen(() => {
    assert.equal(dashboardPage.sidebarRepositories().count, 1, 'expected to see search result in sidebar');
  });
});
