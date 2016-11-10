import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | home/sidebar tabs', {
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

    server.create('broadcast', {
      category: 'warning',
      message: 'Join the resistance!'
    });
  }
});

test('the broadcast tower shows a warning', (assert) => {
  dashboardPage.visit();

  andThen(() => {
    assert.ok(topPage.broadcastTower.hasWarning, 'expected the broadcast tower to have a warning class');
  });
  percySnapshot(assert);
});
