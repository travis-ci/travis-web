import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/filtering', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    // create active repository
    server.create('repository', {
      name: 'living-a-feminist-life',
      owner: {
        login: 'feministkilljoy',
      },
      active: true,
      permissions: {
        admin: true
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
        admin: true
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
        admin: false
      },
    });

    // create other random repository to ensure correct filtering
    server.create('repository', {
      name: 'feminism-is-for-everybody',
      owner: {
        login: 'bellhooks',
      },
      active: false
    });
  }
});

test('filter profile repositories', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(function () {
    percySnapshot(assert);
    assert.equal(profilePage.administerableRepositories().count, 3, 'expected three repositories');

    profilePage.filter('patriarchy');

    andThen(function() {
      assert.equal(profilePage.administerableRepositories().count, 0, 'expected no repositories');
      assert.equal(profilePage.noRepositoriesFoundByFilter, 'Sorry, no results found.');
    });

    profilePage.filter('feminist-lf');
    andThen(function() {
      assert.equal(profilePage.administerableRepositories().count, 1, 'expected one repository');

      assert.equal(profilePage.administerableRepositories(0).name, 'feministkilljoy/living-a-feminist-life');
    });
  });
});
