import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    // create organization
    server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login'
    });

    // Pad with extra organisations to force an extra API response page
    for (let orgIndex = 0; orgIndex < 10; orgIndex++) {
      server.create('organization', {
        name: `Generic org ${orgIndex}`,
        type: 'organization',
        login: `org${orgIndex}`,
      });
    }

    // create active repository
    server.create('repository', {
      name: 'repository-name',
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

    server.create('repository', {
      name: 'github-apps-public-repository',
      owner: {
        login: 'user-login',
      },
      active: true,
      managed_by_github_apps: true,
      private: false
    });

    server.create('repository', {
      name: 'github-apps-private-repository',
      owner: {
        login: 'user-login'
      },
      active: true,
      managed_by_github_apps: true,
      private: true
    });

    server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: 'user-login'
      },
      active: true,
      managed_by_github_apps: true,
      private: false,
      locked: true
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

test('view profile', function (assert) {
  profilePage.visit({ username: 'user-login' });

  andThen(function () {
    percySnapshot(assert);
    assert.equal(document.title, 'User Name - Profile - Travis CI');

    assert.equal(profilePage.name, 'User Name');

    assert.equal(profilePage.accounts.length, 12, 'expected all accounts to be listed');

    assert.equal(profilePage.accounts[0].name, 'User Name');
    assert.equal(profilePage.accounts[1].name, 'Org Name');

    assert.equal(profilePage.administerableRepositories.length, 3, 'expected three classic repositories');

    assert.equal(profilePage.administerableRepositories[0].name, 'user-login/other-repository-name');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[1].name, 'user-login/repository-name');
    assert.ok(profilePage.administerableRepositories[1].isActive, 'expected active repository to appear active');
    assert.equal(profilePage.administerableRepositories[2].name, 'user-login/yet-another-repository-name');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected inactive repository to appear inactive');

    assert.equal(profilePage.githubAppsRepositories.length, 3, 'expected three GitHub Apps-managed repositories');

    assert.equal(profilePage.notLockedGithubAppsRepositories.length, 2, 'expected two not-locked GitHub Apps-managed repositories');
    assert.equal(profilePage.notLockedGithubAppsRepositories[0].name, 'user-login/github-apps-public-repository');
    assert.ok(profilePage.notLockedGithubAppsRepositories[0].isPublic);
    assert.equal(profilePage.notLockedGithubAppsRepositories[1].name, 'user-login/github-apps-private-repository');
    assert.ok(profilePage.notLockedGithubAppsRepositories[1].isPrivate);

    assert.equal(profilePage.lockedGithubAppsRepositories.length, 1, 'expected one locked GitHub Apps-managed repository');
    assert.equal(profilePage.lockedGithubAppsRepositories[0].name, 'user-login/github-apps-locked-repository');
  });
});
