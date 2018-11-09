import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import profilePage from 'travis/tests/pages/profile';

module('Acceptance | profile/update-repositories', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    signInUser(currentUser);

    // create organization
    server.create('organization', {
      name: 'Org Name',
      login: 'org-login',
    });

    // create active repository
    server.create('repository', {
      name: 'repository-name',
      owner: {
        login: 'user-login',
      },
      active: true,
      permissions: {
        admin: true,
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
        admin: true,
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

    // create migrated repository
    server.create('repository', {
      name: 'already-migrated-repository',
      owner: {
        login: 'user-login',
      },
      active: false,
      migration_status: 'migrated',
      permissions: {
        admin: true,
        migrate: true,
      },
    });
  });

  test('updating repository', async function (assert) {
    await profilePage.visit();

    await profilePage.administerableRepositories[1].toggle();
    await profilePage.administerableRepositories[2].toggle();
    await profilePage.administerableRepositories[3].toggle();

    assert.ok(profilePage.administerableRepositories[0].isMigrated, 'expected migrated repository to show migrated link');
    assert.ok(profilePage.administerableRepositories[1].isActive, 'expected unadministerable repository to be unchanged');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected previously enabled repository to be disabled');
    assert.ok(profilePage.administerableRepositories[3].isActive, 'expected previously disabled job to be enabled');
  });
});
