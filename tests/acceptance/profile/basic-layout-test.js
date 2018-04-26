import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import Service from '@ember/service';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    this.user = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(this.user);

    server.create('subscription', {
      owner: this.user,
      status: 'subscribed'
    });

    // create organization
    this.organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login'
    });

    server.create('subscription', {
      owner: this.organization,
      status: 'expired'
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

    assert.equal(profilePage.subscriptionStatus.text, 'This account has an active subscription.');

    assert.equal(profilePage.accounts.length, 12, 'expected all accounts to be listed');

    assert.equal(profilePage.accounts[0].name, 'User Name');
    assert.equal(profilePage.accounts[1].name, 'Org Name');

    assert.equal(profilePage.administerableRepositories.length, 3, 'expected three repositories');

    assert.equal(profilePage.administerableRepositories[0].name, 'user-login/other-repository-name');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[1].name, 'user-login/repository-name');
    assert.ok(profilePage.administerableRepositories[1].isActive, 'expected active repository to appear active');
    assert.equal(profilePage.administerableRepositories[2].name, 'user-login/yet-another-repository-name');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected inactive repository to appear inactive');
  });
});

test('view profile that has an expired subscription', function (assert) {
  profilePage.visit({ username: 'org-login' });

  andThen(() => {
    assert.equal(profilePage.subscriptionStatus.text, 'This account does not have an active subscription.');
  });
});

test('view profile that has education status', function (assert) {
  this.organization.attrs.education = true;
  this.organization.save();

  profilePage.visit({ username: 'org-login' });

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.subscriptionStatus.text, 'This account’s subscription is flagged as educational.');
  });
});

test('displays an error banner when subscription status cannot be determined', function (assert) {
  server.get('/subscriptions', function (schema) {
    return new Response(500, {}, {});
  });

  profilePage.visit({ username: 'user-login' });

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

  profilePage.visit({ username: 'user-login' });
});
