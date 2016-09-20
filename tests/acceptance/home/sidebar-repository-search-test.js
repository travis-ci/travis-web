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

    // create active repo
    server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });
  }
});

test('visiting /home/sidebar-repository-search', function (assert) {
  dashboardPage
    .visit()
    .search('foo')
    .trigger();

  andThen(() => {
    assert.equal(currentURL(), '/search/foo');
  });
});
