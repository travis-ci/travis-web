import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | home/with repositories', {
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

    // create active repo
    server.create('repository', {
      slug: 'killjoys/willful-subjects'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the home page shows the repositories', (assert) => {
  sidebarPage.visit();

  andThen(() => {
    assert.equal(sidebarPage.sidebarRepositories().count, 2, 'expected two repositories in the sidebar');
    assert.equal(sidebarPage.sidebarRepositories(0).name, 'killjoys/willful-subjects');
    assert.equal(sidebarPage.sidebarRepositories(1).name, 'killjoys/living-a-feminist-life');
  });
});
