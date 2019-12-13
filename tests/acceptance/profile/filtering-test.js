import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | profile/filtering', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });
    this.user = currentUser;

    signInUser(currentUser);

    // create organization
    this.server.create('organization', {
      name: 'Org Name',
      login: 'org-login',
    });

    // create active repository
    this.server.create('repository', {
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
    this.server.create('repository', {
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
    this.server.create('repository', {
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
    this.server.create('repository', {
      name: 'feminism-is-for-everybody',
      owner: {
        login: 'bellhooks',
      },
      active: true
    });
  });

  test('filter profile repositories', async function (assert) {
    await profilePage.visit();

    assert.equal(profilePage.administerableRepositories.length, 3, 'expected three repositories');

    await profilePage.filter('patriarchy');

    assert.equal(profilePage.administerableRepositories.length, 0, 'expected no repositories');
    assert.equal(profilePage.noRepositoriesFoundByFilter, 'Sorry, no results found.');

    await profilePage.filter('spec');
    percySnapshot(assert);
    assert.equal(profilePage.administerableRepositories.length, 1, 'expected one repository');

    assert.equal(profilePage.administerableRepositories[0].name, 'specific-repository-name');
  });

  test('paginate and filter GitHub Apps-managed repositories', async function (assert) {
    enableFeature('github-apps');

    this.server.create('installation', {
      owner: this.user,
      github_id: 2691
    });
    this.user.save();

    for (let i = 0; i < 15; i++) {
      this.server.create('repository', {
        name: `github-apps-public-repository-${(i + '').padStart(3, '0')}`,
        owner: {
          login: 'user-login',
        },
        active: true,
        managed_by_installation: true,
        private: false
      });
    }

    await profilePage.visit();

    assert.equal(profilePage.githubAppsRepositories.length, 10, 'expected 10 GitHub Apps-managed repositories on the first page');
    assert.equal(profilePage.githubAppsPages.length, 2, 'expected 2 pages of not-locked repositories');

    assert.equal(profilePage.githubAppsRepositories[0].name, 'github-apps-public-repository-000');
    assert.equal(profilePage.githubAppsRepositories[9].name, 'github-apps-public-repository-009');

    await profilePage.githubAppsPages[1].visit();

    assert.equal(profilePage.githubAppsRepositories.length, 5, 'expected 5 GitHub Apps-managed repositories on the second page');
    assert.equal(profilePage.githubAppsRepositories[0].name, 'github-apps-public-repository-010');

    await profilePage.githubAppsFilter('9');

    assert.equal(profilePage.githubAppsPages.length, 0, 'expected pagination to be hidden when filtering');
    assert.equal(profilePage.githubAppsRepositories.length, 1, 'expected one filtered repository');
    assert.equal(profilePage.githubAppsRepositories[0].name, 'github-apps-public-repository-009');
  });
});
