import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    server.create('installation', {
      owner: currentUser
    });
    currentUser.save();

    let subscription = server.create('subscription', {
      owner: currentUser
    });

    subscription.createBillingInfo({
      first_name: 'User',
      last_name: 'Name',
      company: 'Travis CI GmbH',
      address: 'Rigaerstraße 8',
      address2: 'Address 2',
      city: 'Berlin',
      state: 'Berlin',
      zip_code: '10987',
      country: 'Germany'
    });

    // create organization
    let organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login'
    });

    server.create('installation', {
      owner: organization
    });
    organization.save();

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
      managed_by_installation: true,
      private: false
    });

    server.create('repository', {
      name: 'github-apps-private-repository',
      owner: {
        login: 'user-login'
      },
      active: true,
      managed_by_installation: true,
      private: true
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
  profilePage.visit({ username: 'user-login' });

  andThen(function () {
    percySnapshot(assert);
    assert.equal(document.title, 'User Name - Profile - Travis CI');

    assert.equal(profilePage.name, 'User Name');

    assert.equal(profilePage.accounts.length, 12, 'expected all accounts to be listed');

    assert.equal(profilePage.accounts[0].name, 'User Name');
    assert.equal(profilePage.accounts[1].name, 'Org Name');

    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation not to be visible');

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

test('view a profiles for organizations that do not and do have GitHub Apps installations', function (assert) {
  profilePage.visit({ username: 'org0' });

  andThen(function () {
    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
  });

  profilePage.visit({ username: 'org-login' });

  andThen(function () {
    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
  });
});

test('view billing information', function (assert) {
  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.address.text, 'User Name Travis CI GmbH Rigaerstraße 8 Address 2 Berlin, Berlin 10987 Germany');
  });
});
