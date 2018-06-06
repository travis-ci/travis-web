import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import Service from '@ember/service';

moduleForAcceptance('Acceptance | profile/billing', {
  beforeEach() {
    this.user = server.create('user', {
      name: 'User Name of exceeding length',
      login: 'user-login',
      github_id: 1974,
      avatar_url: 'http://example.com/jorty'
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

    let subscription = server.create('subscription', {
      plan,
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(),
      source: 'stripe'
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
  }
});

test('view billing information', function (assert) {
  profilePage.visit({ username: 'user-login' });
  profilePage.billing.visit();

  andThen(() => {
    percySnapshot(assert);

    assert.equal(profilePage.billing.plan.name, 'Small Business Plan');
    assert.equal(profilePage.billing.plan.concurrency, '5 concurrent builds');

    assert.equal(profilePage.billing.address.text, 'User Name Travis CI GmbH Rigaerstraße 8 Address 2 Berlin, Berlin 10987 Germany');
    assert.equal(profilePage.billing.source, 'This plan is paid through Stripe.');
    assert.equal(profilePage.billing.creditCardNumber, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price, '$69 per month');

    assert.ok(profilePage.billing.annualInvitation.isVisible, 'expected the invitation to switch to annual billing to be visible');

    assert.equal(profilePage.billing.invoices.length, 2);

    profilePage.billing.invoices[1].as(i1919 => {
      assert.equal(i1919.text, '1919 May 1919');
      assert.equal(i1919.href, 'https://example.com/1919.pdf');
    });

    assert.equal(profilePage.billing.invoices[0].text, '2010 February 2010');
  });
});

test('view billing with euros on a manually-managed annual plan', function (assert) {
  this.plan.currency = 'EUR';
  this.plan.annual = true;
  this.plan.price = 10000;
  this.subscription.source = 'manual';

  profilePage.visit({ username: 'user-login'});
  profilePage.billing.visit();

  andThen(() => {
    assert.equal(profilePage.billing.source, 'This is a manual subscription.');
    assert.equal(profilePage.billing.price, '€100 per month');

    assert.ok(profilePage.billing.annualInvitation.isHidden, 'expected the invitation to switch to annual billing to be hidden');
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
  server.create('plan', { id: 'travis-ci-one-build', name: 'AM', builds: 1, price: 6900, currency: 'USD' });
  server.create('plan', { id: 'travis-ci-two-builds', name: 'BM', builds: 2, price: 12900, currency: 'USD' });
  server.create('plan', { id: 'travis-ci-five-builds', name: 'CM', builds: 5, price: 24900, currency: 'USD' });
  server.create('plan', { id: 'travis-ci-ten-builds', name: 'DM', builds: 10, price: 48900, currency: 'USD' });

  server.create('plan', { id: 'travis-ci-one-build-annual', name: 'AA', builds: 1, price: 75900, currency: 'USD', annual: true });
  server.create('plan', { id: 'travis-ci-two-builds-annual', name: 'BA', builds: 2, price: 141900, currency: 'USD', annual: true });
  server.create('plan', { id: 'travis-ci-five-builds-annual', name: 'CA', builds: 5, price: 273900, currency: 'USD', annual: true });
  server.create('plan', { id: 'travis-ci-ten-builds-annual', name: 'DA', builds: 10, price: 537900, currency: 'USD', annual: true });

  assert.expect(31);

  visit('/profile/org-login/billing/edit');

  profilePage.billing.edit.plans[0].click();

  andThen(() => {
    assert.equal(profilePage.billing.edit.plans.length, 4);

    profilePage.billing.edit.plans[0].as(plan => {
      assert.equal(plan.name, 'AM');
      assert.equal(plan.concurrency, '1 concurrent job');
      assert.equal(plan.price, '$69 per month');
      assert.ok(plan.isHighlighted, 'expected the plan to be highlighted');
    });

    assert.ok(profilePage.billing.edit.billing.vatId.isHidden);
  });

  profilePage.billing.edit.cycle.click();

  andThen(() => {
    assert.equal(profilePage.billing.edit.plans[0].name, 'AA');
    assert.notOk(profilePage.billing.edit.plans[0].isHighlighted);
    // FIXME this leaves the controller’s `plan` still set despite the highlighting changing.
  });

  let mockStripe = Service.extend({
    card: Object.freeze({
      createToken(card) {
        assert.equal(card.number, 4242424242424242);
        assert.equal(card.exp_month, 11);
        assert.equal(card.exp_year, 2024);

        assert.equal(card['billing_info[address]'], 'An address');
        assert.equal(card['billing_info[city]'], 'A city');
        assert.equal(card['billing_info[country]'], 'Malta');
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
    assert.equal(body['plan'], 'travis-ci-one-build');
    assert.equal(body['billing_info.first_name'], 'Org');
    assert.equal(body['billing_info.last_name'], 'Person');
    assert.equal(body['billing_info.company'], 'Org Name');
    assert.equal(body['billing_info.address'], 'An address');
    assert.equal(body['billing_info.address2'], 'An address 2');
    assert.equal(body['billing_info.city'], 'A city');
    assert.equal(body['billing_info.state'], 'A state');
    assert.equal(body['billing_info.country'], 'Malta');
    assert.equal(body['billing_info.zip_code'], 'A zip code');
    assert.equal(body['billing_info.billing_email'], 'billing@example.org');
    assert.equal(body['billing_info.vat_id'], 'a vat id');

    let subscription = server.create('subscription');
    return subscription;
  });

  profilePage.billing.edit.creditCard.as(card => {
    card.number.fillIn('4242424242424242');
    card.name.fillIn('Generic name');
    card.expiryMonth.fillIn('11');
    card.expiryYear.fillIn('2024');
    card.cvc.fillIn('999');
  });

  profilePage.billing.edit.billing.country.fillIn('Malta');

  andThen(() => {
    assert.ok(profilePage.billing.edit.billing.vatId.isVisible);
  });

  profilePage.billing.edit.billing.as(billing => {
    billing.firstName.fillIn('Org');
    billing.lastName.fillIn('Person');
    billing.company.fillIn('Org Name');
    billing.address.fillIn('An address');
    billing.address2.fillIn('An address 2');
    billing.city.fillIn('A city');
    billing.state.fillIn('A state');
    billing.zipCode.fillIn('A zip code');
    billing.email.fillIn('billing@example.org');
    billing.vatId.fillIn('a vat id');
  });

  profilePage.billing.edit.save.click();
});
