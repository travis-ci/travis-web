import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import moment from 'moment';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { selectChoose } from 'ember-power-select/test-support';
import { percySnapshot } from 'ember-percy';
import Service from '@ember/service';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubService, stubConfig } from 'travis/tests/helpers/stub-service';
import { getContext } from '@ember/test-helpers';

module('Acceptance | profile/billing', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.user = server.create('user', {
      name: 'User Name of exceeding length',
      type: 'user',
      login: 'user-login',
      github_id: 1974,
      avatar_url: '/images/tiny.gif',
      permissions: {
        createSubscription: true
      }
    });

    signInUser(this.user);

    let trial = server.create('trial', {
      owner: this.user,
      status: 'new',
      builds_remaining: 10,
    });
    this.trial = trial;

    let plan = server.create('plan', {
      name: 'Small Business1',
      builds: 5,
      annual: false,
      currency: 'USD',
      price: 6900
    });
    this.plan = plan;

    server.create('plan', { id: 'travis-ci-one-build', name: 'Bootstrap', builds: 1, price: 6900, currency: 'USD' });
    this.defaultPlan = server.create('plan', { id: 'travis-ci-two-builds', name: 'Startup', builds: 2, price: 12900, currency: 'USD' });
    server.create('plan', { id: 'travis-ci-five-builds', name: 'Premium', builds: 5, price: 24900, currency: 'USD' });
    this.lastPlan = server.create('plan', { id: 'travis-ci-ten-builds', name: 'Small Business', builds: 10, price: 48900, currency: 'USD' });

    server.create('plan', { id: 'travis-ci-one-build-annual', name: 'Bootstrap', builds: 1, price: 75900, currency: 'USD', annual: true });
    this.defaultAnnualPlan = server.create('plan', { id: 'travis-ci-two-builds-annual', name: 'Startup', builds: 2, price: 141900, currency: 'USD', annual: true });
    server.create('plan', { id: 'travis-ci-five-builds-annual', name: 'Premium', builds: 5, price: 273900, currency: 'USD', annual: true });
    server.create('plan', { id: 'travis-ci-ten-builds-annual', name: 'Small Business', builds: 10, price: 537900, currency: 'USD', annual: true });

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
      billing_email: 'user@email.com',
      city: 'Berlin',
      state: 'Berlin',
      zip_code: '10987',
      country: 'Germany',
      vat_id: '12345'
    });

    subscription.createCreditCardInfo({
      last_digits: '1919'
    });

    let organization = server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      permissions: {
        createSubscription: false
      }
    });
    this.organization = organization;
  });

  test('view billing information with invoices', async function (assert) {

    this.subscription.createInvoice({
      id: '1919',
      created_at: new Date(1919, 4, 15),
      url: 'https://example.com/1919.pdf',
      amount_due: 6900
    });

    this.subscription.createInvoice({
      id: '2010',
      created_at: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf',
      amount_due: 6900
    });

    this.subscription.createInvoice({
      id: '20102',
      created_at: new Date(2010, 2, 14),
      url: 'https://example.com/20102.pdf',
      amount_due: 6900
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.ok(profilePage.billing.expiryMessage.isHidden);
    assert.ok(profilePage.billing.marketplaceButton.isHidden);

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Valid until June 19, 2018');

    assert.equal(profilePage.billing.userDetails.text, 'contact name User Name company name Travis CI GmbH billing email user@email.com');
    assert.equal(profilePage.billing.billingDetails.text, 'address Rigaerstraße 8 city Berlin post code 10987 country Germany');
    assert.dom(profilePage.billing.planMessage.scope).hasText('Valid until June 19, 2018');

    assert.equal(profilePage.billing.creditCardNumber.text, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price.text, '$69');
    assert.equal(profilePage.billing.period.text, '/month');

    // Switch to annual plan banner test

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });

    profilePage.billing.invoices.items[1].as(february2010 => {
      assert.equal(february2010.invoiceUrl.href, 'https://example.com/2010.pdf');
      assert.equal(february2010.invoiceDate, 'February 14, 2010');
      assert.equal(february2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(february2010.invoiceCardPrice, '$69.00');
    });
  });

  test('view billing information with invoices year changes correctly', async function (assert) {

    this.subscription.createInvoice({
      id: '2009',
      created_at: new Date(2009, 4, 15),
      url: 'https://example.com/2009.pdf',
      amount_due: 6900
    });

    this.subscription.createInvoice({
      id: '2010',
      created_at: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf',
      amount_due: 6900
    });

    this.subscription.createInvoice({
      id: '20102',
      created_at: new Date(2010, 2, 14),
      url: 'https://example.com/20102.pdf',
      amount_due: 6900
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    percySnapshot(assert);

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });

    profilePage.billing.invoices.items[1].as(february2010 => {
      assert.equal(february2010.invoiceUrl.href, 'https://example.com/2010.pdf');
      assert.equal(february2010.invoiceDate, 'February 14, 2010');
      assert.equal(february2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(february2010.invoiceCardPrice, '$69.00');
    });

    await selectChoose(profilePage.billing.invoices.invoiceSelectYear.scope, '2009');

    profilePage.billing.invoices.items[0].as(may152009 => {
      assert.equal(may152009.invoiceUrl.href, 'https://example.com/2009.pdf');
      assert.equal(may152009.invoiceDate, 'May 15, 2009');
      assert.equal(may152009.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(may152009.invoiceCardPrice, '$69.00');
    });

    await selectChoose(profilePage.billing.invoices.invoiceSelectYear.scope, '2010');

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });
  });

  test('edit subscription contact updates user billing info', async function (assert) {

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.editContactAddressButton.click();

    percySnapshot(assert);

    assert.dom(profilePage.billing.editContactAddressForm.inputs.scope).exists({ count: 4 });

    await profilePage.billing.editContactAddressForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('company', 'Travis')
      .fillIn('billingEmail', 'john@doe.com');

    await profilePage.billing.editContactAddressForm.updateContactAddressButton.click();

    assert.equal(profilePage.billing.userDetails.text, 'contact name John Doe company name Travis billing email john@doe.com');
  });

  test('edit subscription billing updates user billing info', async function (assert) {

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.editBillingAddressButton.click();

    percySnapshot(assert);

    assert.dom(profilePage.billing.editBillingAddressForm.inputs.scope).exists({ count: 3 });

    await selectChoose('.billing-country', 'Nigeria');

    await profilePage.billing.editBillingAddressForm
      .fillIn('address', 'Olalubi')
      .fillIn('city', 'Lagos');

    await profilePage.billing.editBillingAddressForm.updateBillingAddressButton.click();

    assert.equal(profilePage.billing.billingDetails.text, 'address Olalubi city Lagos post code 10987 country Nigeria');
  });

  test('view billing on an expired stripe plan', async function (assert) {
    this.subscription.status = 'expired';

    await profilePage.visit();
    await profilePage.billing.visit();

    // assert resubscribing works.
    assert.ok(profilePage.billing.marketplaceButton.isHidden);
    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });

  test('view billing on an incomplete stripe plan', async function (assert) {
    this.subscription.status = 'incomplete';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan incomplete');
    assert.ok(profilePage.billing.marketplaceButton.isHidden);
    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
  });

  test('cancel a stripe plan', async function (assert) {
    this.subscription.status = 'subscribed';
    const momentFromNow = moment(this.subscription.valid_to.getTime()).fromNow();

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.openCancelSubscriptionModal.click();

    assert.ok(profilePage.billing.dataTestCancelSubscriptionModal.isPresent);

    await profilePage.billing.cancelSubscriptionButton.click();

    assert.ok(profilePage.billing.dataTestCancelSubscriptionModal.error.isPresent);
    assert.equal(profilePage.billing.dataTestCancelSubscriptionModal.cancelReasonOptions.length, 5);

    await profilePage.billing.dataTestCancelSubscriptionModal.cancelReasonOptions[0].click();
    await profilePage.billing.cancelSubscriptionButton.click();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Expires ${momentFromNow} on June 19`);
    assert.equal(profilePage.billing.planMessage.text, `Expires ${momentFromNow} on June 19`);

    assert.equal(profilePage.billing.userDetails.text, 'contact name User Name company name Travis CI GmbH billing email user@email.com');
    assert.equal(profilePage.billing.billingDetails.text, 'address Rigaerstraße 8 city Berlin post code 10987 country Germany');
    assert.dom(profilePage.billing.planMessage.scope).hasText(`Expires ${momentFromNow} on June 19`);

    assert.equal(profilePage.billing.creditCardNumber.text, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price.text, '$69');
    assert.equal(profilePage.billing.period.text, '/month');

    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
    assert.dom(profilePage.billing.resubscribeSubscriptionButton.scope).hasTextContaining('Resubscribe to plan');
  });

  test('resubscribe to a canceled stripe plan', async function (assert) {
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
    assert.dom(profilePage.billing.resubscribeSubscriptionButton.scope).hasTextContaining('Resubscribe to plan');

    await profilePage.billing.resubscribeSubscriptionButton.click();
    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active');
  });

  test('change and resubscribe to a canceled stripe plan', async function (assert) {
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
    assert.dom(profilePage.billing.resubscribeSubscriptionButton.scope).hasTextContaining('Resubscribe to plan');

    await profilePage.billing.changePlanResubscribe.click();
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 5 job plan');
  });

  test('view billing on a canceled stripe plan', async function (assert) {
    this.subscription.status = 'canceled';
    const momentFromNow = moment(this.subscription.valid_to.getTime()).fromNow();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Expires ${momentFromNow} on June 19`);
    assert.equal(profilePage.billing.planMessage.text, `Expires ${momentFromNow} on June 19`);

    assert.equal(profilePage.billing.userDetails.text, 'contact name User Name company name Travis CI GmbH billing email user@email.com');
    assert.equal(profilePage.billing.billingDetails.text, 'address Rigaerstraße 8 city Berlin post code 10987 country Germany');
    assert.dom(profilePage.billing.planMessage.scope).hasText(`Expires ${momentFromNow} on June 19`);

    assert.equal(profilePage.billing.creditCardNumber.text, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price.text, '$69');
    assert.equal(profilePage.billing.period.text, '/month');
  });

  test('view billing on a manual plan with no invoices', async function (assert) {
    this.subscription.source = 'manual';
    this.subscription.status = undefined;
    this.subscription.valid_to = new Date(2025, 7, 16).toISOString();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active manual subscription');
    assert.dom(profilePage.billing.billingSubscription.manualStatus).hasText('manual subscription');
    assert.ok(profilePage.billing.planMessage.isPresent);
    assert.ok(profilePage.billing.manualSubscription.banner.isPresent);
    assert.dom(profilePage.billing.manualSubscription.banner.scope).hasText('This manual subscription is paid to Travis CI by bank transfer. If you have any questions or would like to update your plan, contact our support team.');
  });

  test('view billing on an expired manual plan', async function (assert) {
    this.subscription.source = 'manual';
    this.subscription.status = undefined;
    this.subscription.valid_to = new Date(2018, 6, 16).toISOString();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan expired manual subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Expired July 16, 2018');
    assert.equal(profilePage.billing.planMessage.text, 'Expired July 16, 2018');
    assert.equal(profilePage.billing.price.text, '$69');
    assert.equal(profilePage.billing.billingFormHeading.text, 'Subscribe to a plan');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing on a marketplace plan', async function (assert) {
    this.subscription.source = 'github';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan trial github marketplace subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope)
      .hasTextContaining('5 concurrent jobs Valid until June 19, 2018');
  });

  test('view billing on a cancelled marketplace plan with Stripe plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'canceled';

    server.create('subscription', {
      plan: this.defaultPlan,
      owner: this.user,
      status: 'expired',
      valid_to: new Date(2018, 4, 19),
      source: 'stripe',
      permissions: {
        write: true
      }
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled github marketplace subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Cancelled on June 19, 2018');
    assert.equal(profilePage.billing.planMessage.text, 'Cancelled on June 19, 2018');
    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
    assert.dom(profilePage.billing.resubscribeSubscriptionButton.scope).hasTextContaining('Resubscribe to plan');
    assert.ok(profilePage.billing.billingPlanChoices.boxes.isHidden);
    assert.ok(profilePage.billing.subscribeButton.isHidden);
  });

  test('view billing on a canceled marketplace plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled github marketplace subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Cancelled on June 19, 2018');
    assert.equal(profilePage.billing.planMessage.text, 'Cancelled on June 19, 2018');

    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);

    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing on an expired marketplace plan', async function (assert) {
    this.subscription.source = 'github';
    this.subscription.status = 'expired';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan trial github marketplace subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Expired June 19, 2018');
    assert.equal(profilePage.billing.planMessage.text, 'Expired June 19, 2018');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing on an annual plan', async function (assert) {
    this.plan.annual = true;
    this.plan.price = 10000;

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.price.text, '$100');
    assert.equal(profilePage.billing.period.text, '/year');
    assert.ok(profilePage.billing.annualInvitation.isHidden, 'expected the invitation to switch to annual billing to be hidden');
  });

  test('view billing tab when not subscribed and has subscription write permissions with no trial', async function (assert) {
    this.trial.destroy();
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, '100 free builds to get you started');
    assert.equal(profilePage.billing.trial.subtext, 'Start your trial to get 100 free builds and 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing tab when not subscribed and has subscription write permissions with active trial', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 10 trial builds left');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing tab when there is no subscription and no write permissions', async function (assert) {
    this.subscription.destroy();
    this.user.permissions.createSubscription = false;

    await profilePage.visit();
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.ok(profilePage.billing.trial.activateButton.isHidden);
  });

  test('view billing tab when subscribed and no subscription write permissions', async function (assert) {
    this.subscription.permissions.write = false;
    this.subscription.save();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.annualInvitation.isHidden);
    // assert editing was disabled.
  });

  test('view billing tab when switch is clicked on plan changes correctly', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasTextContaining(`${this.defaultPlan.name}`);
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasTextContaining(`${this.defaultPlan.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasTextContaining(`$${this.defaultPlan.price / 100} /month`);

    await profilePage.billing.switchPlan.click();

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasTextContaining(`${this.defaultAnnualPlan.name}`);
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasTextContaining(`${this.defaultAnnualPlan.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasTextContaining(`$${this.defaultAnnualPlan.price / 100} /year`);
  });

  test('view billing tab when not subscribed select different plan changes correctly', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.billingPlanChoices.lastBox.visit();

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasTextContaining(`${this.lastPlan.name}`);
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasTextContaining(`${this.lastPlan.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasTextContaining(`$${this.lastPlan.price / 100} /month`);
  });

  test('switching to another account’s billing tab loads the subscription form properly', async function (assert) {
    this.organization.permissions = {
      createSubscription: true
    };
    this.organization.save();

    await profilePage.visit();
    await profilePage.accounts[1].visit();
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, '100 free builds to get you started');
    assert.equal(profilePage.billing.trial.subtext, 'Start your trial to get 100 free builds and 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasTextContaining(`${this.lastPlan.name}`);
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasTextContaining(`${this.lastPlan.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasTextContaining(`$${this.lastPlan.price / 100} /month`);

    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 10 job plan');
  });

  test('view billing tab when trial has not started', async function (assert) {
    this.organization.permissions = {
      createSubscription: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    percySnapshot(assert);


    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, '100 free builds to get you started');
    assert.equal(profilePage.billing.trial.subtext, 'Start your trial to get 100 free builds and 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');

    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('view billing tab with no create subscription permissions', async function (assert) {
    this.organization.permissions = {
      createSubscription: false
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.trial.activateButton.isDisabled);
    assert.equal(profilePage.billing.trial.activateButton.text, 'Activate trial');
  });

  test('view billing tab when there is a new trial', async function (assert) {
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'Your trial is active!');
    assert.equal(profilePage.billing.trial.subtext, 'Start building by triggering a build on your dashboard or head over to our docs for information on running your first build .');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');

    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('view billing tab when trial has started', async function (assert) {
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 25 trial builds left');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('view billing tab when trial builds are less than 11', async function (assert) {
    this.subscription = null;
    this.organization.permissions = {
      createSubscription: true
    };
    this.organization.save();
    let trial = server.create('trial', {
      builds_remaining: 10,
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 10 trial builds left');
    assert.ok(profilePage.billing.trial.name.hasRedText, 'Should have red text when builds are less than 11');
    assert.equal(profilePage.billing.trial.buildsRunningOutBanner, 'Your trial is almost finished. Subscribe to a plan before your free builds run out!');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('view billing tab when trial has ended', async function (assert) {
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.subtext, 'Your trial has just ended. To get the most out of Travis CI, set up a plan below!');
    assert.equal(profilePage.billing.trial.buildsRanOutBanner, 'Your trial has ended. Subscribe to a plan to continue building your project!');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('view billing tab with Github trial subscription', async function (assert) {
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    // Assert github trial here.
  });

  test('view billing tab with Github trial subscription has ended', async function (assert) {
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

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    // Assert github trial here.
  });

  test('view billing tab on education account', async function (assert) {
    this.subscription = null;
    this.organization.attrs.education = true;
    this.organization.permissions = { createSubscription: true };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    percySnapshot(assert);

    assert.equal(profilePage.billing.education.name, 'This is an educational account and includes a single build plan. Need help? Check our getting started guide');
    assert.equal(profilePage.billing.newSubscriptionButton.text, 'New subscription');

    await profilePage.billing.newSubscriptionButton.click();

    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @org-login to 2 job plan');
  });

  test('logs an exception when there is a subscription without a plan and handles unknowns', async function (assert) {
    let async = assert.async();

    this.subscription.plan = null;
    this.subscription.save();

    let mockSentry = Service.extend({
      logException(error) {
        assert.equal(error.message, 'User user-login has a subscription with no plan!');
        async();
      },
    });

    stubService('raven', mockSentry);

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Unknown plan active');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('Unknown concurrent jobs Valid until June 19, 2018');
    assert.ok(profilePage.billing.price.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });

  test('view billing tab shows correct selected plan', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');

    await profilePage.billing.subscribeButton.click();

    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultPlan.name} plan`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.defaultPlan.builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultPlan.price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');
  });

  test('view billing tab shows plans selector when change plan button is clicked ', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.subscribeButton.click();

    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultPlan.name} plan`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.defaultPlan.builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultPlan.price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    await profilePage.billing.selectedPlanOverview.changePlan.click();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 10 trial builds left');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, 'We <3 open source');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'You get 3 free additional concurrent jobs for your open source projects.');
    assert.dom(profilePage.billing.billingPlanChoices.boxes.scope).exists({ count: 5 });
    assert.equal(profilePage.billing.subscribeButton.text, 'Subscribe @user-login to 2 job plan');
  });

  test('view billing tab when no individual subscription should fill form and transition to payment', async function (assert) {
    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripev3', 'config', 'config:stripe');
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    const { billingForm, subscribeButton, billingPaymentForm } = profilePage.billing;
    await subscribeButton.click();

    percySnapshot(assert);

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('email', 'john@doe.com')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463')
      .fillIn('coupon', '356463');

    await billingForm.proceedPayment.click();

    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultPlan.name} plan`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.defaultPlan.builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultPlan.price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details:');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'john@doe.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details:');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, 'Startup plan pending');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('2 concurrent jobs');

    assert.equal(profilePage.billing.userDetails.text, 'contact name John Doe company name Travis billing email john@doe.com');
    assert.equal(profilePage.billing.billingDetails.text, 'address 15 Olalubi street city Berlin post code 353564 country Germany');
    assert.dom(profilePage.billing.planMessage.scope).hasText('');
  });

  test('view billing tab when no organization subscription should fill form and transition to payment', async function (assert) {
    this.subscription.destroy();

    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripev3', 'config', 'config:stripe');
    this.organization.permissions = {
      createSubscription: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    const { billingForm, subscribeButton, billingPaymentForm } = profilePage.billing;
    await subscribeButton.click();

    percySnapshot(assert);

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('email', 'john@doe.com')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463')
      .fillIn('coupon', '356463');

    await billingForm.proceedPayment.click();

    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultPlan.name} plan`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.defaultPlan.builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultPlan.price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details:');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'john@doe.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details:');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, 'Startup plan pending');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('2 concurrent jobs');

    assert.equal(profilePage.billing.userDetails.text, 'contact name John Doe company name Travis billing email john@doe.com');
    assert.equal(profilePage.billing.billingDetails.text, 'address 15 Olalubi street city Berlin post code 353564 country Germany');
    assert.dom(profilePage.billing.planMessage.scope).hasText('');
  });
});
