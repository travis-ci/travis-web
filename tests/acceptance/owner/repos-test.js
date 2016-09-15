import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import ownerPage from 'travis/tests/pages/owner';

moduleForAcceptance('Acceptance | owner repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

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

test('the owner page shows their repositories', (assert) => {
  ownerPage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.equal(ownerPage.repos().count, 3);
  });
});
