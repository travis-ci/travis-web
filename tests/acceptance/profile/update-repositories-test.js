import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/update-repositories', {
  beforeEach() {
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
  }
});

test('updating repository', function (assert) {
  profilePage.visit();

  andThen(() => {
    profilePage.administerableRepositories[0].toggle();
    profilePage.administerableRepositories[1].toggle();
    profilePage.administerableRepositories[2].toggle();
  });

  andThen(() => {
    assert.ok(profilePage.administerableRepositories[0].isActive, 'expected unadministerable repository to be unchanged');
    assert.notOk(profilePage.administerableRepositories[1].isActive, 'expected previously enabled repository to be disabled');
    assert.ok(profilePage.administerableRepositories[2].isActive, 'expected previously disabled job to be enabled');
  });
});
