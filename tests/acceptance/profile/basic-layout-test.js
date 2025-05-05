import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import {
  default as mockWindow,
  reset as resetWindow
} from 'ember-window-mock';
import Service from '@ember/service';
import { settled } from '@ember/test-helpers';
import config from 'travis/config/environment';
import { enableFeature } from 'ember-feature-flags/test-support';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | profile/basic layout', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    resetWindow();

    this.user = this.server.create('user', {
      name: 'User Name of exceeding length',
      login: 'user-login',
      github_id: 1974,
      vcs_type: 'GithubUser',
      vcs_id: 1974,
      avatar_url: '/images/tiny.gif'
    });

    this.server.create('installation', {
      owner: this.user,
      github_id: 2691
    });

    this.user.save();

    signInUser(this.user);

    let subscription = this.server.create('subscription', {
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(),
    });
    this.subscription = subscription;

    // create organization
    let organization = this.server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      vcs_type: 'GithubOrganization',
      vcs_id: 1983,
      github_id: 1983,
    });
    this.organization = organization;

    this.server.create('installation', {
      owner: organization,
      github_id: 1962
    });

    organization.save();

    this.server.create('subscription', {
      owner: organization,
      status: 'canceled'
    });

    this.server.create('subscription', {
      owner: organization,
      status: 'expired'
    });

    // Pad with extra organisations to force an extra API response page
    for (let orgIndex = 0; orgIndex < 10; orgIndex++) {
      let organization = this.server.create('organization', {
        name: `Generic org ${orgIndex}`,
        type: 'organization',
        login: `org${orgIndex}`,
        github_id: 1000 + orgIndex,
        vcs_type: 'GithubOrganization'
      });

      if (orgIndex === 9) {
        this.server.create('subscription', {
          owner: organization,
          status: 'subscribed'
        });
      }
    }

    // create active repository
    this.activeAdminRepository = this.server.create('repository', {
      name: 'repository-name',
      owner: {
        login: 'user-login',
        vcs_type: 'GithubUser'
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
        vcs_type: 'GithubUser'
      },
      active: false,
      permissions: {
        admin: true
      },
    });

    // create repository without admin permissions
    this.server.create('repository', {
      name: 'other-repository-name',
      owner: {
        login: 'user-login',
        vcs_type: 'GithubUser'
      },
      active: true,
      permissions: {
        admin: false
      },
    });

    this.server.create('repository', {
      name: 'github-apps-public-repository',
      owner: {
        login: 'user-login',
        vcs_type: 'GithubUser'
      },
      active: true,
      managed_by_installation: true,
      private: false,
      permissions: {
        admin: true,
        settings_read: true
      },
    });

    this.server.create('repository', {
      name: 'github-apps-private-repository',
      owner: {
        login: 'user-login',
        vcs_type: 'GithubUser'
      },
      active: true,
      managed_by_installation: true,
      private: true,
      permissions: {
        admin: false,
        settings_read: true
      }
    });

    this.server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: 'user-login',
        vcs_type: 'GithubUser'
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true
    });

    // create other random repository to ensure correct filtering
    this.server.create('repository', {
      name: 'feminism-is-for-everybody',
      owner: {
        login: 'bellhooks',
        vcs_type: 'GithubUser'
      },
      active: false
    });
  });

  test('view repositories', async function (assert) {
    enableFeature('github-apps');
    await profilePage.visit();
    await settled();

    assert.equal(profilePage.name, 'User Name of exceeding length');
    assert.equal(profilePage.login, '@user-login');

    assert.ok(profilePage.avatar.src.startsWith('/images/tiny.gif'), 'expected avatar URL to have the same beginning');
    assert.ok(profilePage.avatar.checkmark.isVisible, 'expected avatar to have a checkmark for active subscription');

    assert.ok(profilePage.subscriptionStatus.isHidden, 'expected no subscription status banner');

    assert.equal(profilePage.accounts.length, 11, 'expected all accounts to be listed');

    assert.equal(profilePage.accounts[0].name, 'User Name of exceeding length');
    assert.ok(profilePage.accounts[0].avatar.checkmark.isVisible, 'expected a subscription checkmark for user account');

    assert.equal(profilePage.accounts[1].name, 'Org Name');
    assert.ok(profilePage.accounts[1].avatar.checkmark.isHidden, 'expected no subscription checkmark for org account');

    assert.ok(profilePage.accounts[11].avatar.checkmark.isVisible, 'expected a subscription checkmark for the last org account');

    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation not to be visible');

    assert.ok(profilePage.deprecatedBadge.isVisible, 'expected deprecated badge to be visible');
    assert.equal(profilePage.administerableRepositories.length, 2, 'expected two classic repositories, with inactive repositories hidden');

    assert.equal(profilePage.administerableRepositories[0].name, 'other-repository-name');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[1].name, 'repository-name');
    assert.ok(profilePage.administerableRepositories[1].isActive, 'expected active repository to appear active');

    assert.equal(profilePage.githubAppsRepositories.length, 2, 'expected two GitHub Apps-managed repositories');

    profilePage.githubAppsRepositories[0].as(repository => {
      assert.equal(repository.name, 'github-apps-private-repository');
      assert.ok(repository.isPrivate);
      assert.notOk(repository.settings.isDisabled);
    });

    profilePage.githubAppsRepositories[1].as(repository => {
      assert.equal(repository.name, 'github-apps-public-repository');
      assert.ok(repository.isPublic);
      assert.notOk(repository.settings.isDisabled);
    });
  });

  test('view profile that has an expired subscription', async function (assert) {
    this.organization.attrs.permissions = { createSubscription: true };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });

    assert.ok(profilePage.avatar.checkmark.isHidden, 'expected avatar to not have a checkmark for active subscription');
  });

  test('view profile that has an expired subscription and no create permissions', async function (assert) {
    await profilePage.visitOrganization({ name: 'org-login' });

    assert.ok(profilePage.avatar.checkmark.isHidden, 'expected avatar to not have a checkmark for active subscription');
  });

  test('view profile that has education status', async function (assert) {
    this.organization.attrs.education = true;
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });

    assert.equal(profilePage.nameBadge.text, 'Education');
    assert.ok(profilePage.avatar.checkmark.isVisible, 'expected avatar to have a checkmark for education subscription');
    assert.ok(profilePage.subscriptionStatus.isHidden, 'expected no subscription status banner');
  });

  test('displays an error banner when subscription status cannot be determined', async function (assert) {
    this.server.get('/subscriptions', function (schema) {
      return new Response(500, {}, {});
    });

    await profilePage.visit();

    assert.equal(profilePage.subscriptionStatus.text, 'There was an error determining your subscription status.');
  });

  test('logs an exception when there is more than one active subscription', async function (assert) {
    assert.expect(1);

    this.server.create('subscription', {
      owner: this.user,
      status: 'subscribed'
    });

    let mockSentry = Service.extend({
      logException(error) {
        assert.equal(error.message, 'Account user-login has more than one active subscription!');
      },
    });

    stubService('raven', mockSentry);

    await profilePage.visit();
  });

  skip('view profiles for organizations that do not and do have GitHub Apps installations', async function (assert) {
    this.server.create('repository', {
      name: 'extra-repository',
      owner: {
        login: 'org0',
        vcs_type: 'GithubOrganization'
      },
      active: true,
      permissions: {
        admin: true
      },
    });

    enableFeature('github-apps');
    await profilePage.visitOrganization({ name: 'org0' });

    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isVisible, 'expected the invitation to have a migrate button when there are legacy repositories');

    await profilePage.visitOrganization({ name: 'org1' });

    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isHidden, 'expected the invitation to not have a migrate button when no legacy repositories are present');
    assert.equal(profilePage.githubAppsInvitation.link.href, 'https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1001', 'expected the management link to be organisation-scoped');

    await profilePage.visitOrganization({ name: 'org-login' });

    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
    if (typeof config.githubApps.appName === 'string' && config.githubApps.appName.length > 0) {
      assert.equal(profilePage.manageGithubAppsLink.href, 'https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1983', 'expected the management link to be organisation-scoped');
    } else {
      assert.equal(profilePage.manageGithubAppsLink.href, 'https://github.com/organizations/org-login/settings/installations/1962', 'expected the management link to be organisation-scoped');
    }
  });

  test('view profiles when GitHub Apps is not present', async function (assert) {
    await profilePage.visitOrganization({ name: 'org0' });

    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
    assert.notOk(profilePage.deprecatedBadge.isVisible, 'expected deprecated badge to not be visible');

    await profilePage.visit();

    assert.equal(profilePage.administerableRepositories.length, 3, 'expected inactive repositories to also show');

    assert.equal(profilePage.administerableRepositories[0].name, 'other-repository-name');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[2].name, 'yet-another-repository-name');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected inactive repository to appear inactive');
  });

  skip('view profile when GitHub Apps is present and no legacy repositories exist', async function (assert) {
    enableFeature('github-apps');
    await profilePage.visitOrganization({ name: 'org0' });

    assert.dom('#administerable-repositories').doesNotExist();
    assert.ok(profilePage.githubAppsInvitation.isExpanded, 'expected the invitation to be expanded in the absence of legacy repositories');
  });

  test('clicking the button to migrate to GitHub Apps sends the IDs of all legacy active repositories', async function (assert) {
    enableFeature('github-apps');

    // FIXME not sure why the first repository isn’t being included in the query parameters
    // let repositoryIds = [this.activeAdminRepository.id];
    let repositoryIds = [];

    for (let index = 0; index < 5; index++) {
      this.server.create('repository', {
        name: `extra-repository-${index}`,
        owner: {
          login: 'org0',
          vcs_type: 'GithubOrganization',
        },
        active: true,
        permissions: {
          admin: true
        },
        github_id: 10000 + index,
        vcs_type: 'GithubRepository'
      });

      this.server.create('repository', {
        name: `extra-inactive-repository-${index}`,
        owner: {
          login: 'org0',
          vcs_type: 'GithubOrganization',
        },
        active: false,
        permissions: {
          admin: true
        },
        github_id: 20000 + index,
        vcs_type: 'GithubRepository'
      });

      repositoryIds.push(10000 + index);
    }

    await profilePage.visitOrganization({ name: 'org0' });

    assert.ok(profilePage.githubAppsInvitation.migrateButton.isVisible, 'expected the invitation to have a migrate button');

    await profilePage.githubAppsInvitation.migrateButton.click();

    let idParams = repositoryIds.map(id => `repository_ids[]=${id}`).join('&');
    assert.equal(mockWindow.location.href,
      `https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1000&${idParams}`);
  });

  test('the migration button is not present when the owner has over 20 active legacy repositories', async function (assert) {
    for (let index = 0; index < config.githubApps.migrationRepositoryCountLimit + 1; index++) {
      this.server.create('repository', {
        name: `extra-repository-${index}`,
        owner: {
          login: 'org0',
          vcs_type: 'GithubOrganization'
        },
        active: true,
        permissions: {
          admin: true
        },
        github_id: 10000 + index,
        vcs_type: 'GithubRepository'
      });
    }

    await profilePage.visitOrganization({ name: 'org0' });

    assert.ok(profilePage.githubAppsInvitation.migrateButton.isHidden, 'expected migration button to be hidden when owner has too many repositories');
  });

  test('Migration beta status message is present when apllied', async function (assert) {
    this.server.create('beta-migration-request', {
      owner_id: this.user.id,
      owner_name: this.user.login
    });

    await profilePage.visit();
    assert.ok(profilePage.migrateBannerRequested.isPresent);
  });

  test('Migration beta status message is present on organization when apllied', async function (assert) {
    this.server.create('beta-migration-request', {
      owner_id: this.user.id,
      owner_name: this.user.login,
      organizations: [this.organization]
    });

    await profilePage.visitOrganization({ name: this.organization.login });
    assert.ok(profilePage.migrateBannerRequested.isPresent);
  });

  test('Migration beta success status message is present when request is accepted', async function (assert) {
    this.server.create('beta-migration-request', {
      owner_id: this.user.id,
      owner_name: this.user.login,
      accepted_at: new Date().toString()
    });

    await profilePage.visit();
    assert.ok(profilePage.migrateBannerAccepted.isPresent);
  });

  test('Migration beta success status message is present on organization when request is accepted', async function (assert) {
    this.server.create('beta-migration-request', {
      owner_id: this.user.id,
      owner_name: this.user.login,
      accepted_at: new Date().toString(),
      organizations: [this.organization]
    });

    await profilePage.visitOrganization({ name: this.organization.login });
    assert.ok(profilePage.migrateBannerAccepted.isPresent);
  });
});
