import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/filtering', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });
    this.user = currentUser;

    signInUser(currentUser);

    // create organization
    server.create('organization', {
      name: 'Org Name',
      login: 'org-login',
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
      active: true,
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
      active: true
    });
  }
});

test('filter profile repositories', function (assert) {
  profilePage.visit();

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

      assert.equal(profilePage.administerableRepositories[0].name, 'specific-repository-name');
    });
  });
});

test('paginate and filter GitHub Apps-managed repositories', function (assert) {
  withFeature('github-apps');

  this.userInstallation = server.create('installation', {
    owner: this.user
  });
  this.user.save();

  for (let i = 0; i < 15; i++) {
    server.create('repository', {
      name: `github-apps-public-repository-${(i + '').padStart(3, '0')}`,
      owner: {
        login: 'user-login',
      },
      active: true,
      managed_by_installation: true,
      private: false
    });
  }

  profilePage.visit();

  andThen(() => {
    assert.equal(profilePage.githubAppsRepositories.length, 10, 'expected 10 GitHub Apps-managed repositories on the first page');
    assert.equal(profilePage.notLockedGithubAppsPages.length, 2, 'expected 2 pages of not-locked repositories');

    assert.equal(profilePage.notLockedGithubAppsRepositories[0].name, 'github-apps-public-repository-000');
    assert.equal(profilePage.notLockedGithubAppsRepositories[9].name, 'github-apps-public-repository-009');
  });

  profilePage.notLockedGithubAppsPages[1].visit();

  andThen(() => {
    assert.equal(profilePage.githubAppsRepositories.length, 5, 'expected 5 GitHub Apps-managed repositories on the second page');
    assert.equal(profilePage.notLockedGithubAppsRepositories[0].name, 'github-apps-public-repository-010');
  });

  profilePage.notLockedGithubAppsFilter('9');

  andThen(() => {
    assert.equal(profilePage.notLockedGithubAppsPages.length, 0, 'expected pagination to be hidden when filtering');
    assert.equal(profilePage.notLockedGithubAppsRepositories.length, 1, 'expected one filtered repository');
    assert.equal(profilePage.notLockedGithubAppsRepositories[0].name, 'github-apps-public-repository-009');
  });
});
