import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/billing', {
  beforeEach() {
    this.user = server.create('user', {
      name: 'User Name of exceeding length',
      type: 'user',
      login: 'user-login',
      github_id: 1974,
      avatar_url: 'http://example.com/jorty',
      permissions: {
        createSubscription: true
      }
    });

    signInUser(this.user);

    let plan = server.create('plan', {
      name: 'Small Business Plan',
      builds: 5,
      annual: false,
      currency: 'USD',
      price: 6900
    });
    this.plan = plan;

    server.create('plan', { id: 'travis-ci-one-build', name: 'AM', builds: 1, price: 6900, currency: 'USD' });
    server.create('plan', { id: 'travis-ci-two-builds', name: 'BM', builds: 2, price: 12900, currency: 'USD' });
    server.create('plan', { id: 'travis-ci-five-builds', name: 'CM', builds: 5, price: 24900, currency: 'USD' });
    server.create('plan', { id: 'travis-ci-ten-builds', name: 'DM', builds: 10, price: 48900, currency: 'USD' });

    server.create('plan', { id: 'travis-ci-one-build-annual', name: 'AA', builds: 1, price: 75900, currency: 'USD', annual: true });
    server.create('plan', { id: 'travis-ci-two-builds-annual', name: 'BA', builds: 2, price: 141900, currency: 'USD', annual: true });
    server.create('plan', { id: 'travis-ci-five-builds-annual', name: 'CA', builds: 5, price: 273900, currency: 'USD', annual: true });
    server.create('plan', { id: 'travis-ci-ten-builds-annual', name: 'DA', builds: 10, price: 537900, currency: 'USD', annual: true });

    let subscription = server.create('subscription', {
      plan,
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(2018, 5, 19),
      source: 'stripe',
      permissions: {
        write: true
      }
    });
    this.subscription = subscription;

    subscription.createBillingInfo({
      first_name: 'User',
      last_name: 'Name',
      company: 'Travis CI GmbH',
      address: 'Rigaerstraße 8',
      address2: 'Address 2',
      city: 'Berlin',
      state: 'Berlin',
      zip_code: '10987',
      country: 'Germany',
      vat_id: '12345'
    });

    subscription.createCreditCardInfo({
      last_digits: '1919'
    });

    // create organization
    let organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      permissions: {
        createSubscription: false
      }
    });
    this.organization = organization;
  }
});

test('view billing information with invoices', function (assert) {
  this.subscription.createInvoice({
    id: '1919',
    created_at: new Date(1919, 4, 15),
    url: 'https://example.com/1919.pdf'
  });

  this.subscription.createInvoice({
    id: '2010',
    created_at: new Date(2010, 1, 14),
    url: 'https://example.com/2010.pdf'
  });

  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);

    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/user');
    assert.notOk(profilePage.billing.manageButton.isDisabled);
    assert.notOk(profilePage.billing.manageButton.isNew);
    assert.equal(profilePage.billing.manageButton.text, 'Edit subscription');
    assert.ok(profilePage.billing.expiryMessage.isHidden);
    assert.ok(profilePage.billing.marketplaceButton.isHidden);

    assert.equal(profilePage.billing.plan.name, 'Small Business Plan');
    assert.equal(profilePage.billing.plan.concurrency, '5 concurrent jobs');

    assert.equal(profilePage.billing.address.text, 'User Name Travis CI GmbH Rigaerstraße 8 Address 2 Berlin, Berlin 10987 Germany VAT: 12345');
    assert.equal(profilePage.billing.source, 'This plan is paid through Stripe.');
    assert.equal(profilePage.billing.creditCardNumber.text, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price.text, '$69 per month');

    assert.ok(profilePage.billing.annualInvitation.isVisible, 'expected the invitation to switch to annual billing to be visible');

    assert.equal(profilePage.billing.invoices.items.length, 2);

    profilePage.billing.invoices.items[1].as(i1919 => {
      assert.equal(i1919.text, '1919 May 1919');
      assert.equal(i1919.href, 'https://example.com/1919.pdf');
    });

    assert.equal(profilePage.billing.invoices.items[0].text, '2010 February 2010');
  });
});

test('view billing on an expired stripe plan', function (assert) {
  this.subscription.status = 'expired';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.expiryMessage.text, 'You had a Stripe subscription that expired on June 19, 2018.');
    assert.equal(profilePage.billing.manageButton.text, 'Resubscribe');
    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/user');

    assert.ok(profilePage.billing.marketplaceButton.isHidden);
    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing on a canceled stripe plan', function (assert) {
  this.subscription.status = 'canceled';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.expiryMessage.text, 'This subscription has been canceled by you and is valid through June 19, 2018.');
    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/user');
    assert.equal(profilePage.billing.manageButton.text, 'Resubscribe');

    assert.ok(profilePage.billing.marketplaceButton.isHidden);
    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing on a manual plan with no invoices', function (assert) {
  this.subscription.source = 'manual';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.ok(profilePage.billing.manageButton.isHidden);
    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.price.isHidden);
    assert.equal(profilePage.billing.source, 'This is a manual subscription.');
    assert.ok(profilePage.billing.annualInvitation.isHidden);

    assert.ok(profilePage.billing.invoices.isHidden);
  });
});

test('view billing on a marketplace plan', function (assert) {
  this.subscription.source = 'github';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.manageButton.href, 'https://github.com/marketplace/travis-ci/');

    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.equal(profilePage.billing.source, 'This subscription is managed by GitHub Marketplace.');
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing on an canceled marketplace plan', function (assert) {
  this.subscription.source = 'github';
  this.subscription.status = 'canceled';

  profilePage.visit({
    username: 'user-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.expiryMessage.text, 'This subscription has been canceled by you and is valid through June 19, 2018.');
    assert.equal(profilePage.billing.marketplaceButton.text, 'Continue with GitHub Marketplace');
    assert.equal(profilePage.billing.marketplaceButton.href, 'https://github.com/marketplace/travis-ci/');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/new?id=user');

    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing on an expired marketplace plan', function (assert) {
  this.subscription.source = 'github';
  this.subscription.status = 'expired';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.expiryMessage.text, 'You had a GitHub Marketplace subscription that expired on June 19, 2018.');
    assert.equal(profilePage.billing.marketplaceButton.text, 'Continue with GitHub Marketplace');
    assert.equal(profilePage.billing.marketplaceButton.href, 'https://github.com/marketplace/travis-ci/');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/new?id=user');

    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing on an annual plan', function (assert) {
  this.plan.annual = true;
  this.plan.price = 10000;

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.price.text, '$100 per year');
    assert.ok(profilePage.billing.annualInvitation.isHidden, 'expected the invitation to switch to annual billing to be hidden');
  });
});

test('view billing tab when no subscription write permissions', function (assert) {
  this.subscription.permissions.write = false;
  this.subscription.save();

  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();

  andThen(() => {
    assert.ok(profilePage.billing.annualInvitation.isHidden);
    assert.ok(profilePage.billing.manageButton.isDisabled, 'expected disabled subscription management button when lacking permissions');
  });
});

test('view billing tab when there is no subscription', function (assert) {
  profilePage.visit({ username: 'org-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.ok(profilePage.billing.expiryMessage.isHidden);

    assert.ok(profilePage.billing.manageButton.isDisabled, 'expected no subscription management button when lacking permissions');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
  });
});

test('switching to another account’s billing tab loads the subscription properly', function (assert) {
  this.organization.permissions = {
    createSubscription: true
  };
  this.organization.save();

  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();
  profilePage.accounts[1].visit();

  andThen(() => {
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
    assert.equal(profilePage.billing.manageButton.href, 'https://billing.travis-ci.com/subscriptions/new?id=org-login');
  });
});

test('view billing tab when trial has not started', function (assert) {
  this.organization.permissions = {
    createSubscription: true
  };
  this.organization.save();

  profilePage.visit({
    username: 'org-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, 'Trigger your first build to start testing your projects!');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
  });
});

test('view billing tab with no create subscription permissions', function (assert) {
  this.organization.permissions = {
    createSubscription: false
  };
  this.organization.save();

  profilePage.visit({
    username: 'org-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, 'Trigger your first build to start testing your projects!');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
    assert.ok(profilePage.billing.manageButton.isDisabled);
  });
});

test('view billing tab when there is a new trial', function (assert) {
  this.subscription = null;
  this.organization.permissions = {
    createSubscription: true
  };
  this.organization.save();
  let trial = server.create('trial', {
    builds_remaining: 100,
    owner: this.organization,
    status: 'new',
    created_at: new Date(2018, 7, 16),
    permissions: {
      read: true,
      write: true
    }
  });

  this.trial = trial;
  this.trial.save();

  profilePage.visit({
    username: 'org-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, "You've got 100 trial builds left. Ensure unlimited builds by setting up a plan before it runs out!");
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
  });
});

test('view billing tab when trial has started', function (assert) {
  this.subscription = null;
  this.organization.permissions = {
    createSubscription: true
  };
  this.organization.save();
  let trial = server.create('trial', {
    builds_remaining: 25,
    owner: this.organization,
    status: 'started',
    created_at: new Date(2018, 7, 16),
    permissions: {
      read: true,
      write: true
    }
  });
  this.trial = trial;
  this.trial.save();

  profilePage.visit({
    username: 'org-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, "You've got 25 trial builds left. Ensure unlimited builds by setting up a plan before it runs out!");
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
  });
});

test('view billing tab when trial has ended', function (assert) {
  this.subscription = null;
  this.organization.permissions = {
    createSubscription: true
  };
  this.organization.save();
  let trial = server.create('trial', {
    builds_remaining: 0,
    owner: this.organization,
    status: 'ended',
    created_at: new Date(2018, 7, 16),
    permissions: {
      read: true,
      write: true
    }
  });
  this.trial = trial;
  this.trial.save();

  profilePage.visit({
    username: 'org-login'
  });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, 'Your trial has just ended. To get the most out of Travis CI, set up a plan below!');
    assert.equal(profilePage.billing.manageButton.text, 'New subscription');
  });
});

test('view billing tab with Github trial subscription', function (assert) {
  let trial = server.create('trial', {
    builds_remaining: 0,
    owner: this.organization,
    status: 'started',
    created_at: new Date(2018, 7, 16),
    permissions: {
      read: true,
      write: true
    }
  });

  this.subscription.owner = this.organization;
  this.subscription.source = 'github';

  trial.save();
  this.subscription.save();

  profilePage.visit({ username: 'org-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.trial.name, "You're trialing Travis CI via your Github Marketplace subscription.");
    assert.equal(profilePage.billing.manageButton.text, 'Edit subscription');
    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.equal(profilePage.billing.source, 'This subscription is managed by GitHub Marketplace.');
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});

test('view billing tab with Github trial subscription has ended', function (assert) {
  let trial = server.create('trial', {
    builds_remaining: 0,
    owner: this.organization,
    status: 'ended',
    created_at: new Date(2018, 7, 16),
    permissions: {
      read: true,
      write: true
    }
  });

  this.subscription.owner = this.organization;
  this.subscription.source = 'github';

  trial.save();
  this.subscription.save();

  profilePage.visit({ username: 'org-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);
    assert.equal(profilePage.billing.manageButton.text, 'Edit subscription');
    assert.ok(profilePage.billing.address.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.equal(profilePage.billing.source, 'This subscription is managed by GitHub Marketplace.');
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });
});
