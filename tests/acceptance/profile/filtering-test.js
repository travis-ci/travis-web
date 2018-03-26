import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/filtering', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      repos_count: 30
    });

    // create active repository
    server.create('repository', {
      name: 'specific-repository-name',
      owner: {
        login: 'user-login',
      },
      active: true,
      permissions: {
        admin: true
      },
    });

    // create inactive repository
    server.create('repository', {
      name: 'yet-another-repository-name',
      owner: {
        login: 'user-login',
      },
      active: false,
      permissions: {
        admin: true
      },
    });

    // create repository without admin permissions
    server.create('repository', {
      name: 'other-repository-name',
      owner: {
        login: 'user-login',
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
  profilePage.visit({ username: 'user-login' });

  andThen(function () {
    assert.equal(profilePage.administerableRepositories.length, 3, 'expected three repositories');

    profilePage.filter('patriarchy');

    andThen(function () {
      assert.equal(profilePage.administerableRepositories.length, 0, 'expected no repositories');
      assert.equal(profilePage.noRepositoriesFoundByFilter, 'Sorry, no results found.');
    });

    profilePage.filter('spec');
    andThen(function () {
      percySnapshot(assert);
      assert.equal(profilePage.administerableRepositories.length, 1, 'expected one repository');

      assert.equal(profilePage.administerableRepositories[0].name, 'user-login/specific-repository-name');
    });
  });
});
