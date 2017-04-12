import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/update-repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3,
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30,
    });

    // create active repository
    server.create('repository', {
      name: 'living-a-feminist-life',
      owner: {
        login: 'feministkilljoy',
      },
      active: true,
      permissions: {
        admin: true,
      },
    });

    // create inactive repository
    server.create('repository', {
      name: 'willful-subjects',
      owner: {
        login: 'feministkilljoy',
      },
      active: false,
      permissions: {
        admin: true,
      },
    });

    // create repository without admin permissions
    server.create('repository', {
      name: 'affect-theory-reader',
      owner: {
        login: 'feministkilljoy',
      },
      active: true,
      permissions: {
        admin: false,
      },
    });

    // create other random repository to ensure correct filtering
    server.create('repository', {
      name: 'feminism-is-for-everybody',
      owner: {
        login: 'bellhooks',
      },
      active: false,
      permissions: {
        admin: false,
      },
    });
  }
});

test('updating repository', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  profilePage.administerableRepositories(0).toggle();
  profilePage.administerableRepositories(1).toggle();
  profilePage.unadministerableRepositories(0).toggle();

  andThen(() => {
    assert.notOk(server.db.repositories[0].active, 'expected formerly active repository to be inactive');
    assert.ok(server.db.repositories[1].active, 'expected formerly inactive repository to be active');
    assert.ok(server.db.repositories[2].active, 'expected unadministerable repository to be unchanged');
  });
});
