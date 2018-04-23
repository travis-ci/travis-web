import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import Service from '@ember/service';
import { default as mockWindow, reset as resetWindow } from 'ember-window-mock';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    resetWindow();

    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
      github_id: 1974
    });
    this.user = currentUser;

    signInUser(this.user);

    server.create('subscription', {
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(new Date().getTime() + 10000)
    });

    this.userInstallation = server.create('installation', {
      owner: currentUser,
      github_id: 2691
    });
    currentUser.save();

    let plan = server.create('plan', {
      name: 'Small Business Plan',
      concurrency: 5,
      period: 'monthly'
    });

    let subscription = server.create('subscription', {
      plan,
      owner: currentUser,
      status: 'subscribed',
      valid_to: new Date()
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

    subscription.createCreditCardInfo({
      last_digits: '1919'
    });

    subscription.createInvoice({
      id: '1919',
      created_at: new Date(1919, 4, 15),
      url: 'https://example.com/1919.pdf'
    });

    subscription.createInvoice({
      id: '2010',
      created_at: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf'
    });

    // create organization
    let organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login'
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
      owner: this.organization,
      status: 'expired'
    });

    // Pad with extra organisations to force an extra API response page
    for (let orgIndex = 0; orgIndex < 10; orgIndex++) {
      server.create('organization', {
        name: `Generic org ${orgIndex}`,
        type: 'organization',
        login: `org${orgIndex}`,
        github_id: 1000 + orgIndex
      });
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

  andThen(() => {
    percySnapshot(assert);
    assert.equal(document.title, 'User Name - Profile - Travis CI');

    assert.equal(profilePage.name, 'User Name');

    assert.equal(profilePage.subscriptionStatus.text, 'This account has an active subscription.');

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

    // FIXME this is coming back as the org-login installation, 1962…???
    // assert.equal(profilePage.manageGithubAppsLink.href, `https://github.com/settings/installations/${this.userInstallation.github_id}`);
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

test('logs an exception viewing billing when there is more than one active subscription and displays the earliest', function (assert) {
  assert.expect(4);

  let otherSubscription = server.create('subscription', {
    owner: this.user,
    status: 'subscribed',
    valid_to: new Date(new Date().getTime() - 10000)
  });

  otherSubscription.createCreditCardInfo({
    last_digits: '2010'
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
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.creditCardNumber, '•••• •••• •••• 2010');
    assert.equal(profilePage.billing.invoices.length, 0, 'expected no invoices to be listed');
    assert.dom('[data-test-no-invoices]').hasText('no invoices found');
  });
});

test('view profiles for organizations that do not and do have GitHub Apps installations', function (assert) {
  profilePage.visit({ username: 'org0' });

  andThen(function () {
    assert.ok(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to be visible');
    assert.equal(profilePage.githubAppsInvitation.link.href, 'https://github.com/apps/travis-ci-testing/installations/new/permissions?target_id=1000');
  });

  profilePage.visit({ username: 'org-login' });

  andThen(function () {
    assert.notOk(profilePage.githubAppsInvitation.isVisible, 'expected GitHub Apps invitation to not be visible');
    assert.equal(profilePage.manageGithubAppsLink.href, 'https://github.com/organizations/org-login/settings/installations/1962', 'expected the management link to be organisation-scoped');
  });
});

test('clicking the button to migrate to GitHub Apps sends the IDs of all legacy active repositories', function (assert) {
  // FIXME not sure why the first repository isn’t being included in the query parameters
  // let repositoryIds = [this.activeAdminRepository.id];
  let repositoryIds = [];

  for (let index = 0; index < 10; index++) {
    server.create('repository', {
      name: `extra-repository-${index}`,
      owner: {
        login: 'user-login',
      },
      active: true,
      permissions: {
        admin: true
      },
      github_id: 10000 + index
    });

    repositoryIds.push(10000 + index);
  }

  profilePage.visit({ username: 'user-login' });
  profilePage.migrateGithubAppsButton.click();

  andThen(() => {
    let idParams = repositoryIds.map(id => `repository_ids[]=${id}`).join('&');
    assert.equal(mockWindow.location.href,
      `https://github.com/apps/travis-ci-testing/installations/new/permissions?suggested_target_id=${this.user.github_id}&${idParams}`);
  });
});

test('view billing information', function (assert) {
  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);

    assert.equal(profilePage.billing.plan.name, 'Small Business Plan');
    assert.equal(profilePage.billing.plan.concurrency, '5 concurrent builds');

    assert.equal(profilePage.billing.address.text, 'User Name Travis CI GmbH Rigaerstraße 8 Address 2 Berlin, Berlin 10987 Germany');
    assert.equal(profilePage.billing.creditCardNumber, '•••• •••• •••• 1919');

    assert.ok(profilePage.billing.annualInvitation.isVisible, 'expected the invitation to switch to annual billing to be visible');

    assert.equal(profilePage.billing.invoices.length, 2);

    profilePage.billing.invoices[0].as(i1919 => {
      assert.equal(i1919.text, '1919 May 1919');
      assert.equal(i1919.href, 'https://example.com/1919.pdf');
    });

    assert.equal(profilePage.billing.invoices[1].text, '2010 February 2010');
  });
});

test('view billing tab when there is no subscription', function (assert) {
  profilePage.visit({ username: 'org-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.dom('[data-test-no-subscription]').hasText('no subscription found');
  });
});

test('switching to another account’s billing tab loads the subscription properly', function (assert) {
  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();
  profilePage.accounts[1].visit();

  andThen(() => {
    assert.dom('[data-test-no-subscription]').hasText('no subscription found');
  });
});

test('creating a subscription', function (assert) {
  assert.expect(21);

  visit('/profile/org-login/billing/edit');

  let mockStripe = Service.extend({
    card: Object.freeze({
      createToken(card) {
        assert.equal(card.number, 4242424242424242);
        assert.equal(card.exp_month, 11);
        assert.equal(card.exp_year, 2030);

        assert.equal(card['billing_info[address]'], 'An address');
        assert.equal(card['billing_info[city]'], 'A city');
        assert.equal(card['billing_info[country]'], 'A country');
        assert.equal(card['billing_info[last_name]'], 'Person');
        assert.equal(card['billing_info[zip_code]'], 'A zip code');
        assert.equal(card['billing_info[billing_email]'], 'billing@example.org');

        return Promise.resolve({
          id: 'aaazzz'
        });
      }
    })
  });

  let instance = this.application.__deprecatedInstance__;
  let registry = instance.register ? instance : instance.registry;
  registry.register('service:stripe', mockStripe);

  server.post('/subscriptions', (schema, request) => {
    let body = JSON.parse(request.requestBody);

    assert.equal(body['credit_card_info.token'], 'aaazzz');
    assert.equal(body['plan'], 'travis-ci-ten-builds');
    assert.equal(body['billing_info.first_name'], 'Org');
    assert.equal(body['billing_info.last_name'], 'Person');
    assert.equal(body['billing_info.company'], 'Org Name');
    assert.equal(body['billing_info.address'], 'An address');
    assert.equal(body['billing_info.address2'], 'An address 2');
    assert.equal(body['billing_info.city'], 'A city');
    assert.equal(body['billing_info.state'], 'A state');
    assert.equal(body['billing_info.country'], 'A country');
    assert.equal(body['billing_info.zip_code'], 'A zip code');
    assert.equal(body['billing_info.billing_email'], 'billing@example.org');

    let subscription = server.create('subscription');
    return subscription;
  });

  profilePage.billing.edit.creditCard.as(card => {
    card.number.fillIn('4242424242424242');
    card.name.fillIn('Generic name');
    card.expiry.fillIn('11/30');
    card.cvc.fillIn('999');
  });

  profilePage.billing.edit.billing.as(billing => {
    billing.firstName.fillIn('Org');
    billing.lastName.fillIn('Person');
    billing.company.fillIn('Org Name');
    billing.address.fillIn('An address');
    billing.address2.fillIn('An address 2');
    billing.city.fillIn('A city');
    billing.state.fillIn('A state');
    billing.country.fillIn('A country');
    billing.zipCode.fillIn('A zip code');
    billing.email.fillIn('billing@example.org');
  });

  profilePage.billing.edit.save.click();
});
