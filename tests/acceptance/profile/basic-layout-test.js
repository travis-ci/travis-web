import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { default as mockWindow, reset as resetWindow } from 'ember-window-mock';
import Service from '@ember/service';
import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    resetWindow();

    this.user = server.create('user', {
      name: 'User Name of exceeding length',
      login: 'user-login',
      github_id: 1974,
      avatar_url: '/images/tiny.gif'
    });

    signInUser(this.user);

    server.create('installation', {
      owner: this.user,
      github_id: 2691
    });
    this.user.save();

    let subscription = server.create('subscription', {
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(),
    });
    this.subscription = subscription;

    // create organization
    let organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      github_id: 1983
    });
    this.organization = organization;

    server.create('installation', {
      owner: organization,
      github_id: 1962
    });

    organization.save();

    server.create('subscription', {
      owner: organization,
      status: 'canceled'
    });

    server.create('subscription', {
      owner: organization,
      status: 'expired'
    });

    // Pad with extra organisations to force an extra API response page
    for (let orgIndex = 0; orgIndex < 10; orgIndex++) {
      let organization = server.create('organization', {
        name: `Generic org ${orgIndex}`,
        type: 'organization',
        login: `org${orgIndex}`,
        github_id: 1000 + orgIndex
      });

      if (orgIndex === 9) {
        server.create('subscription', {
          owner: organization,
          status: 'subscribed'
        });
      }
    }

    // create active repository
    this.activeAdminRepository = server.create('repository', {
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
      managed_by_installation: true,
      private: false,
      permissions: {
        admin: true
      },
    });

    server.create('repository', {
      name: 'github-apps-private-repository',
      owner: {
        login: 'user-login'
      },
      active: true,
      managed_by_installation: true,
      private: true,
      permissions: {
        admin: false
      }
    });

    server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: 'user-login'
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true
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

test('view repositories', function (assert) {
  withFeature('github-apps');
  profilePage.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(document.title, 'User Name of exceeding length - Profile - Travis CI');

    assert.equal(profilePage.name, 'User Name of exceeding length');
    assert.equal(profilePage.login, '@user-login');

    assert.ok(profilePage.avatar.src.startsWith('/images/tiny.gif'), 'expected avatar URL to have the same beginning');
    assert.ok(profilePage.avatar.checkmark.isVisible, 'expected avatar to have a checkmark for active subscription');

    assert.ok(profilePage.subscriptionStatus.isHidden, 'expected no subscription status banner');

    assert.equal(profilePage.accounts.length, 12, 'expected all accounts to be listed');

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
      assert.ok(repository.settings.isDisabled);
    });

    profilePage.githubAppsRepositories[1].as(repository => {
      assert.equal(repository.name, 'github-apps-public-repository');
      assert.ok(repository.isPublic);
      assert.notOk(repository.settings.isDisabled);
    });
  });
});

test('view profile that has an expired subscription', function (assert) {
  this.organization.attrs.permissions = { createSubscription: true };
  this.organization.save();

  profilePage.visitOrganization({ name: 'org-login' });

  andThen(() => {
    assert.ok(profilePage.avatar.checkmark.isHidden, 'expected avatar to not have a checkmark for active subscription');
  });
});

test('view profile that has an expired subscription and no create permissions', function (assert) {
  profilePage.visitOrganization({ name: 'org-login' });

  andThen(() => {
    assert.ok(profilePage.avatar.checkmark.isHidden, 'expected avatar to not have a checkmark for active subscription');
  });
});

test('view profile that has education status', function (assert) {
  this.organization.attrs.education = true;
  this.organization.save();

  profilePage.visitOrganization({ name: 'org-login' });

  andThen(() => {
    assert.equal(profilePage.nameBadge.text, 'Education');
    assert.ok(profilePage.avatar.checkmark.isVisible, 'expected avatar to have a checkmark for education subscription');
    assert.ok(profilePage.subscriptionStatus.isHidden, 'expected no subscription status banner');
  });
});

test('displays an error banner when subscription status cannot be determined', function (assert) {
  server.get('/subscriptions', function (schema) {
    return new Response(500, {}, {});
  });

  profilePage.visit();

  andThen(() => {
    assert.equal(profilePage.subscriptionStatus.text, 'There was an error determining your subscription status.');
  });
});

test('logs an exception when there is more than one active subscription', function (assert) {
  assert.expect(1);

  server.create('subscription', {
    owner: this.user,
    status: 'subscribed'
  });

  let mockSentry = Service.extend({
    logException(error) {
      assert.equal(error.message, 'Account user-login has more than one active subscription!');
    },
  });

  const instance = this.application.__deprecatedInstance__;
  const registry = instance.register ? instance : instance.registry;
  registry.register('service:raven', mockSentry);

  profilePage.visit();
});

test('view profiles for organizations that do not and do have GitHub Apps installations', function (assert) {
  server.create('repository', {
    name: 'extra-repository',
    owner: {
      login: 'org0',
    },
    active: true,
    permissions: {
      admin: true
    },
  });

  withFeature('github-apps');
  profilePage.visitOrganization({ name: 'org0' });

  andThen(function () {
    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isVisible, 'expected the invitation to have a migrate button when there are legacy repositories');
  });

  profilePage.visitOrganization({ name: 'org1' });

  andThen(function () {
    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isHidden, 'expected the invitation to not have a migrate button when no legacy repositories are present');
    assert.equal(profilePage.githubAppsInvitation.link.href, 'https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1001', 'expected the management link to be organisation-scoped');
  });

  profilePage.visitOrganization({ name: 'org-login' });

  andThen(function () {
    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
    if (typeof config.githubApps.appName === 'string' && config.githubApps.appName.length > 0) {
      assert.equal(profilePage.manageGithubAppsLink.href, 'https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1983', 'expected the management link to be organisation-scoped');
    } else {
      assert.equal(profilePage.manageGithubAppsLink.href, 'https://github.com/organizations/org-login/settings/installations/1962', 'expected the management link to be organisation-scoped');
    }
  });
});

test('view profiles when GitHub Apps is not present', function (assert) {
  profilePage.visitOrganization({ name: 'org0' });

  andThen(() => {
    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
    assert.notOk(profilePage.deprecatedBadge.isVisible, 'expected deprecated badge to not be visible');
  });

  profilePage.visit();

  andThen(() => {
    assert.equal(profilePage.administerableRepositories.length, 3, 'expected inactive repositories to also show');

    assert.equal(profilePage.administerableRepositories[0].name, 'other-repository-name');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[2].name, 'yet-another-repository-name');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected inactive repository to appear inactive');
  });
});

test('view profile when GitHub Apps is present and no legacy repositories exist', function (assert) {
  withFeature('github-apps');
  profilePage.visitOrganization({ name: 'org0' });

  andThen(() => {
    percySnapshot(assert);
    assert.dom('#administerable-repositories').doesNotExist();
    assert.ok(profilePage.githubAppsInvitation.isExpanded, 'expected the invitation to be expanded in the absence of legacy repositories');
  });
});

test('clicking the button to migrate to GitHub Apps sends the IDs of all legacy active repositories', function (assert) {
  withFeature('github-apps');

  // FIXME not sure why the first repository isn’t being included in the query parameters
  // let repositoryIds = [this.activeAdminRepository.id];
  let repositoryIds = [];

  for (let index = 0; index < 5; index++) {
    server.create('repository', {
      name: `extra-repository-${index}`,
      owner: {
        login: 'org0',
      },
      active: true,
      permissions: {
        admin: true
      },
      github_id: 10000 + index
    });

    server.create('repository', {
      name: `extra-inactive-repository-${index}`,
      owner: {
        login: 'org0',
      },
      active: false,
      permissions: {
        admin: true
      },
      github_id: 20000 + index
    });

    repositoryIds.push(10000 + index);
  }

  profilePage.visitOrganization({ name: 'org0' });

  andThen(() => {
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isVisible, 'expected the invitation to have a migrate button');
  });

  profilePage.githubAppsInvitation.migrateButton.click();

  andThen(() => {
    let idParams = repositoryIds.map(id => `repository_ids[]=${id}`).join('&');
    assert.equal(mockWindow.location.href,
      `https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=1000&${idParams}`);
  });
});

test('the migration button is not present when the owner has over 20 active legacy repositories', function (assert) {
  for (let index = 0; index < config.githubApps.migrationRepositoryCountLimit + 1; index++) {
    server.create('repository', {
      name: `extra-repository-${index}`,
      owner: {
        login: 'org0',
      },
      active: true,
      permissions: {
        admin: true
      },
      github_id: 10000 + index
    });
  }

  profilePage.visitOrganization({ name: 'org0' });

  andThen(() => {
    assert.ok(profilePage.githubAppsInvitation.migrateButton.isHidden, 'expected migration button to be hidden when owner has too many repositories');
  });
});

test('Migration beta section is present on sidebar', async function (assert) {
  await profilePage.visit();
  assert.ok(profilePage.sidebarMigrate.isPresent);
});

test('Migration beta dialog renders properly', async function (assert) {
  await profilePage.visit();
  await profilePage.sidebarMigrate.signUpButton.click();

  const { isPresent, accountsSelect, submit } = profilePage.migrateDialog;
  assert.ok(isPresent);
  assert.ok(accountsSelect.isPresent);

  await accountsSelect.click();
  assert.ok(accountsSelect.options.length > 0);

  assert.ok(submit.isPresent);
});

test('Migration beta dialog sends request', async function (assert) {
  let isRequested = false;
  let requestUserId = null;
  let organizations = [];

  server.post('/user/:id/beta_migration_request', function (schema, request) {
    let requestBody = JSON.parse(request.requestBody);

    isRequested = true;
    requestUserId = request.params.id;
    organizations = requestBody.organizations;
  });

  await profilePage.visit();
  await profilePage.sidebarMigrate.signUpButton.click();
  await profilePage.migrateDialog.submit.click();

  assert.ok(isRequested);
  assert.equal(requestUserId, this.user.id);
  assert.ok(organizations);
  assert.ok(organizations.length > 0);
});

test('Migration beta status message is present when apllied', async function (assert) {
  server.create('beta-migration-request', {
    owner_id: this.user.id
  });

  await profilePage.visit();
  assert.ok(profilePage.migrateBannerRequested.isPresent);
});

test('Migration beta status message is present on organization when apllied', async function (assert) {
  server.create('beta-migration-request', {
    owner_id: this.user.id,
    organizations: [this.organization]
  });

  await profilePage.visitOrganization({ name: this.organization.login });
  assert.ok(profilePage.migrateBannerRequested.isPresent);
});

test('Migration beta success status message is present when request is accepted', async function (assert) {
  server.create('beta-migration-request', {
    owner_id: this.user.id,
    accepted_at: new Date().toString()
  });

  await profilePage.visit();
  assert.ok(profilePage.migrateBannerAccepted.isPresent);
});

test('Migration beta success status message is present on organization when request is accepted', async function (assert) {
  server.create('beta-migration-request', {
    owner_id: this.user.id,
    accepted_at: new Date().toString(),
    organizations: [this.organization]
  });

  await profilePage.visitOrganization({ name: this.organization.login });
  assert.ok(profilePage.migrateBannerAccepted.isPresent);
});
