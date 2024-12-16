/* eslint max-len: 0 */
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { selectChoose } from 'ember-power-select/test-support';
import Service from '@ember/service';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubService, stubConfig } from 'travis/tests/helpers/stub-service';
import { getContext, click } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  BILLING_INFO_ADD_EMAIL,
} from 'travis/tests/helpers/selectors';

module('Acceptance | profile/billing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.user = this.server.create('user', {
      name: 'User Name of exceeding length',
      type: 'user',
      login: 'user-login',
      github_id: 1974,
      avatar_url: '/images/tiny.gif',
      permissions: {
        createSubscription: true
      }
    });
    this.server.create('allowance', {subscription_type: 1});

    signInUser(this.user);

    let trial = this.server.create('trial', {
      owner: this.user,
      status: 'new',
      builds_remaining: 10,
    });
    this.trial = trial;

    this.server.create('v2-plan-config', {
      id: 'free_tier_plan', name: 'Free Tier Plan', startingPrice: 0,
      startingUsers: 999999, privateCredits: 10000, publicCredits: 40000,
      isFree: true, isUnlimitedUsers: true, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered'
    });
    this.server.create('v2-plan-config', {
      id: 'yearly_basic_plan', name: 'Basic', startingPrice: 3000,
      startingUsers: 100, privateCredits: 25000, publicCredits: 40000,
      isFree: false, isUnlimitedUsers: false, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered', isAnnual: true
    });
    this.server.create('v2-plan-config', {
      id: 'pro_tier_plan', name: 'Pro Tier Plan', startingPrice: 30000,
      startingUsers: 10000, privateCredits: 500000, publicCredits: 40000,
      isFree: false, isUnlimitedUsers: false, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered', isAnnual: true
    });
    this.defaultV2Plan = this.server.create('v2-plan-config', {
      id: 'standard_tier_plan', name: 'Standard Tier Plan', startingPrice: 3000,
      startingUsers: 100, privateCredits: 25000, publicCredits: 40000,
      isFree: false, isUnlimitedUsers: false, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered'
    });
    this.defaultV2Plan.save();

    let plan = this.server.create('plan', {
      name: 'Small Business1',
      builds: 5,
      annual: false,
      currency: 'USD',
      price: 6900
    });
    this.plan = plan;

    this.server.create('plan', { id: 'travis-ci-one-build', name: 'Bootstrap', builds: 1, price: 6900, currency: 'USD' });
    this.defaultPlan = this.server.create('plan', { id: 'travis-ci-two-builds', name: 'Startup', builds: 2, price: 12900, currency: 'USD' });
    this.server.create('plan', { id: 'travis-ci-five-builds', name: 'Premium', builds: 5, price: 24900, currency: 'USD' });
    this.lastPlan = this.server.create('plan', { id: 'travis-ci-ten-builds', name: 'Small Business', builds: 10, price: 48900, currency: 'USD' });

    this.server.create('plan', { id: 'travis-ci-one-build-annual', name: 'Bootstrap', builds: 1, price: 75900, currency: 'USD', annual: true });
    this.defaultAnnualPlan = this.server.create('plan', { id: 'travis-ci-two-builds-annual', name: 'Startup', builds: 2, price: 141900, currency: 'USD', annual: true });
    this.server.create('plan', { id: 'travis-ci-five-builds-annual', name: 'Premium', builds: 5, price: 273900, currency: 'USD', annual: true });
    this.server.create('plan', { id: 'travis-ci-ten-builds-annual', name: 'Small Business', builds: 10, price: 537900, currency: 'USD', annual: true });

    let subscription = this.server.create('subscription', {
      plan,
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(2018, 5, 19),
      created_at: new Date(2018, 5, 19),
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

    let organization = this.server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      permissions: {
        createSubscription: false,
        admin: true
      }
    });
    this.organization = organization;

    this.coupons = this.server.createList('coupon', 3);
  });

  skip('view billing information with invoices', async function (assert) {
    this.subscription.createInvoice({
      id: '1919',
      created_at: new Date(1919, 4, 15),
      url: 'https://example.com/1919.pdf',
      status: 'paid',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    this.subscription.createInvoice({
      id: '2010',
      created_at: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf',
      status: 'paid',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    this.subscription.createInvoice({
      id: '20102',
      created_at: new Date(2010, 2, 14),
      url: 'https://example.com/20102.pdf',
      status: 'open',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.expiryMessage.isHidden);
    assert.ok(profilePage.billing.marketplaceButton.isHidden);

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active');
    assert.dom(profilePage.billing.planMessage.scope).hasText('Valid until June 19, 2018');

    assert.equal(profilePage.billing.creditCardNumber.text, '•••• •••• •••• 1919');
    assert.equal(profilePage.billing.price.text, '$69');
    assert.equal(profilePage.billing.period.text, '/month');

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '-');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });

    profilePage.billing.invoices.items[1].as(february2010 => {
      assert.equal(february2010.invoiceUrl.href, 'https://example.com/2010.pdf');
      assert.equal(february2010.invoiceDate, 'February 14, 2010');
      assert.equal(february2010.invoiceCardDigits, '-');
      assert.equal(february2010.invoiceCardPrice, '$69.00');
    });
  });

  skip('view billing information with invoices year changes correctly', async function (assert) {
    this.subscription.createInvoice({
      id: '2009',
      created_at: new Date(2009, 4, 15),
      url: 'https://example.com/2009.pdf',
      status: 'paid',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    this.subscription.createInvoice({
      id: '2010',
      created_at: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf',
      status: 'paid',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    this.subscription.createInvoice({
      id: '20102',
      created_at: new Date(2010, 2, 14),
      url: 'https://example.com/20102.pdf',
      status: 'paid',
      amount_due: 6900,
      cc_last_digits: '1919'
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '-');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });

    profilePage.billing.invoices.items[1].as(february2010 => {
      assert.equal(february2010.invoiceUrl.href, 'https://example.com/2010.pdf');
      assert.equal(february2010.invoiceDate, 'February 14, 2010');
      assert.equal(february2010.invoiceCardDigits, '-');
      assert.equal(february2010.invoiceCardPrice, '$69.00');
    });

    await selectChoose(profilePage.billing.invoices.invoiceSelectYear.scope, '2009');

    profilePage.billing.invoices.items[0].as(may152009 => {
      assert.equal(may152009.invoiceUrl.href, 'https://example.com/2009.pdf');
      assert.equal(may152009.invoiceDate, 'May 15, 2009');
      assert.equal(may152009.invoiceCardDigits, '-');
      assert.equal(may152009.invoiceCardPrice, '$69.00');
    });

    await selectChoose(profilePage.billing.invoices.invoiceSelectYear.scope, '2010');

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '-');
      assert.equal(march2010.invoiceCardPrice, '$69.00');
    });
  });

  test('create subscription with a forever discount', async function (assert) {
    this.subscription.createDiscount({
      name: '10_PERCENT_OFF',
      percent_off: null,
      amount_off: 1000,
      duration: 'forever',
      duration_in_months: null,
      valid: true
    });

    await profilePage.visit();
    await profilePage.billing.visit();


    assert.dom('[data-test-stripe-discount]').hasText('Discount: $10 forever');
  });

  test('create subscription with a 10% discount', async function (assert) {
    this.subscription.created_at = new Date(2018, 5, 16);
    this.subscription.createDiscount({
      name: '10_PERCENT_OFF',
      percent_off: 10,
      amount_off: null,
      duration: '',
      duration_in_months: 3,
      valid: true
    });

    await profilePage.visit();
    await profilePage.billing.visit();


    assert.dom('[data-test-stripe-discount]').hasText('Discount: 10% off until September 2018');
  });

  test('create subscription with a $10 discount', async function (assert) {
    this.subscription.created_at = new Date(2018, 5, 16);
    this.subscription.createDiscount({
      name: '10_PERCENT_OFF',
      percent_off: null,
      amount_off: 1000,
      duration: '',
      duration_in_months: 3,
      valid: true
    });

    await profilePage.visit();
    await profilePage.billing.visit();


    assert.dom('[data-test-stripe-discount]').hasText('Discount: $10 off until September 2018');
  });

  skip('edit subscription contact updates user billing info', async function (assert) {
    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.editContactAddressButton.click();


    assert.dom(profilePage.billing.editContactAddressForm.inputs.scope).exists({ count: 4 });

    await profilePage.billing.editContactAddressForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('company', 'Travis');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');

    await click(BILLING_INFO_ADD_EMAIL);
    await profilePage.billing.billingEmails.objectAt(1).fillEmail('jane@email.com');

    await profilePage.billing.editContactAddressForm.updateContactAddressButton.click();

    assert.equal(profilePage.billing.userDetails.text, 'contact name John Doe company name Travis billing email joe@jane.com jane@email.com');
  });

  skip('edit subscription billing updates user billing info', async function (assert) {
    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.editBillingAddressButton.click();


    assert.dom(profilePage.billing.editBillingAddressForm.inputs.scope).exists({ count: 4 });

    await selectChoose('.billing-country', 'Nigeria');

    await profilePage.billing.editBillingAddressForm
      .fillIn('address', 'Olalubi')
      .fillIn('city', 'Lagos');

    await profilePage.billing.editBillingAddressForm.updateBillingAddressButton.click();

    assert.equal(profilePage.billing.billingDetails.text, 'address Olalubi city Lagos post code 10987 country Nigeria vat id 12345');
  });

  test('view billing on an expired stripe plan', async function (assert) {
    this.subscription.status = 'expired';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.marketplaceButton.isHidden);

    await profilePage.billing.changePlanResubscribe.click();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { selectedPlan, billingPaymentForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'User Name');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'user@email.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details');
    assert.equal(billingPaymentForm.contactDetails.address.text, 'Rigaerstraße 8');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, `${this.defaultV2Plan.name}`);
  });

  test('view billing on an incomplete stripe plan', async function (assert) {
    this.subscription.status = 'incomplete';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan incomplete');
    assert.ok(profilePage.billing.marketplaceButton.isHidden);
  });

  test('cancel a stripe plan', async function (assert) {
    this.subscription.status = 'subscribed';

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.openCancelSubscriptionConfirmationModal.click();
    await profilePage.billing.cancelSubscriptionButton.click();

    assert.equal(topPage.flashMessage.text, 'Your cancellation request has been forwarded to Support. Our Support team will contact you soon. Please turn off auto-refill if you don\'t plan to use it anymore.');

    assert.ok(profilePage.billing.cancellationRequestedButton.isPresent);
  });

  test('keep subscription on the confirmation modal', async function (assert) {
    this.subscription.status = 'subscribed';

    await profilePage.visit();
    await profilePage.billing.visit();
    await profilePage.billing.openCancelSubscriptionConfirmationModal.click();
    await profilePage.billing.keepSubscriptionButton.click();

    assert.ok(topPage.flashMessage.isNotShown);
    assert.false(profilePage.billing.cancellationRequestedButton.isPresent);
  });

  test('change and resubscribe to a canceled stripe plan', async function (assert) {
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
  });

  test('view billing on a canceled stripe plan', async function (assert) {
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled');
    assert.equal(profilePage.billing.planMessage.text, 'Expired on June 19, 2018');

    assert.dom(profilePage.billing.planMessage.scope).hasText('Expired on June 19, 2018');

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
    assert.equal(profilePage.billing.billingSubscription.manualStatus, 'manual subscription');
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
    assert.equal(profilePage.billing.planMessage.text, 'Expired on July 16, 2018');
    assert.equal(profilePage.billing.price.text, '$69');
  });

  test('view billing on an expired manual plan with future expiration date', async function (assert) {
    this.subscription.status = 'canceled';
    this.subscription.valid_to = new Date(2028, 6, 16).toISOString();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.planMessage.text, 'Expires on July 16, 2028');
  });

  test('view billing on a marketplace plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active github marketplace subscription');
  });

  test('view billing tab with marketplace trial subscription', async function (assert) {
    let trial = this.server.create('trial', {
      builds_remaining: 0,
      owner: this.organization,
      status: 'started',
      hasActiveTrial: true,
      created_at: new Date(2018, 7, 16),
      permissions: {
        read: true,
        write: true,
        plan_view: true,
        billing_view: true,
      }
    });

    this.organization.permissions = {
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
    };

    this.subscription.owner = this.organization;
    this.subscription.source = 'github';

    trial.save();
    this.subscription.save();

    await profilePage.visitOrganization({ name: 'org-login' });

    await profilePage.billing.visit();


    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan trial github marketplace subscription');
  });

  test('view billing tab when marketplace trial subscription has ended', async function (assert) {
    let trial = this.server.create('trial', {
      builds_remaining: 0,
      owner: this.organization,
      status: 'ended',
      hasActiveTrial: false,
      created_at: new Date(2018, 7, 16),
      permissions: {
        read: true,
        write: true,
        plan_view: true,
        billing_view: true,
      }
    });

    this.organization.permissions = {
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
    };

    this.subscription.owner = this.organization;
    this.subscription.source = 'github';
    this.subscription.status = 'expired';

    trial.save();
    this.subscription.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan expired github marketplace subscription');
  });


  test('view billing on an active marketplace plan and expired Stripe plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'subscribed';

    this.server.create('subscription', {
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

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan active github marketplace subscription');
    assert.ok(profilePage.billing.inactiveResubscribeSubscriptionButton.isDisabled);
    assert.ok(profilePage.billing.inactiveChangePlanResubscribe.isDisabled);
    assert.dom(profilePage.billing.inactiveResubscribeSubscriptionButton.scope).hasTextContaining('Resubscribe to plan');
    assert.dom(profilePage.billing.inactiveChangePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
  });

  test('view billing on a cancelled marketplace plan with Stripe plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'canceled';

    this.server.create('subscription', {
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
    assert.equal(profilePage.billing.planMessage.text, 'Cancelled on June 19, 2018');
    assert.dom(profilePage.billing.changePlanResubscribe.scope).hasTextContaining('Subscribe to different plan');
  });

  test('view billing on a canceled marketplace plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'canceled';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan canceled github marketplace subscription');
    assert.equal(profilePage.billing.planMessage.text, 'Cancelled on June 19, 2018');

    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);
  });

  test('view billing on an expired marketplace plan', async function (assert) {
    this.trial.destroy();
    this.subscription.source = 'github';
    this.subscription.status = 'expired';

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.userDetails.isHidden);
    assert.ok(profilePage.billing.billingDetails.isHidden);
    assert.ok(profilePage.billing.creditCardNumber.isHidden);
    assert.ok(profilePage.billing.annualInvitation.isHidden);

    assert.equal(profilePage.billing.plan.name, 'Small Business1 plan expired github marketplace subscription');
    assert.equal(profilePage.billing.planMessage.text, 'Expired on June 19, 2018');
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

  test('view billing tab when not subscribed and has subscription write permissions', async function (assert) {
    this.trial.destroy();
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.billingPlanChoices.isPresent);
    assert.ok(profilePage.billing.billingPlanChoices.isVisible);
  });

  test('view billing tab when not subscribed and has subscription write permissions with active trial', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 10 trial builds left');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, '5 concurrent jobs, free!');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'We <3 open source! You will always get 3 free additional concurrent jobs for your open source projects.');

    assert.ok(profilePage.billing.billingPlanChoices.isPresent);
    assert.ok(profilePage.billing.billingPlanChoices.isVisible);
  });

  test('view billing tab when there is no subscription and no write permissions', async function (assert) {
    this.subscription.destroy();
    this.user.permissions.createSubscription = false;

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.trial.activateButton.isHidden);
  });

  test('view billing tab when subscribed and no subscription write permissions', async function (assert) {
    this.subscription.permissions.write = false;
    this.subscription.save();

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.cancelSubscriptionButton.isHidden);
    assert.ok(profilePage.billing.resubscribeSubscriptionButton.isHidden);
  });

  test('switching to another account’s billing tab loads the subscription form properly', async function (assert) {
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visit();
    await profilePage.accounts[1].visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.billingPlanChoices.isPresent);
    assert.ok(profilePage.billing.billingPlanChoices.isVisible);
  });

  test('view billing tab when trial has not started', async function (assert) {
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.billingPlanChoices.isPresent);
    assert.ok(profilePage.billing.billingPlanChoices.isVisible);
  });

  test('view billing tab with no create subscription permissions', async function (assert) {
    this.organization.permissions = {
      createSubscription: false,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.noPermissionMessage.isPresent);
    assert.ok(profilePage.billing.noPermissionMessage.isVisible);
  });

  test('view billing tab when there is a new trial', async function (assert) {
    this.subscription = null;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();
    let trial = this.server.create('trial', {
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
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, '5 concurrent jobs, free!');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'We <3 open source! You will always get 3 free additional concurrent jobs for your open source projects.');
  });

  test('view billing tab when trial has started', async function (assert) {
    this.subscription = null;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();
    let trial = this.server.create('trial', {
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

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 25 trial builds left');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, '5 concurrent jobs, free!');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'We <3 open source! You will always get 3 free additional concurrent jobs for your open source projects.');
  });

  test('view billing tab when trial builds are less than 11', async function (assert) {
    this.subscription = null;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();
    let trial = this.server.create('trial', {
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

    assert.equal(profilePage.billing.trial.overviewHeading, 'Overview');
    assert.equal(profilePage.billing.trial.name.text, 'You have 10 trial builds left');
    assert.ok(profilePage.billing.trial.name.hasRedText, 'Should have red text when builds are less than 11');
    assert.equal(profilePage.billing.trial.buildsRunningOutBanner, 'Your trial is almost finished. Subscribe to a plan before your free builds run out!');
    assert.equal(profilePage.billing.trial.subtext, 'The trial includes 2 concurrent jobs for both public and private projects.');
    assert.ok(profilePage.billing.trial.openSourceMessage.isPresent);
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, '5 concurrent jobs, free!');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'We <3 open source! You will always get 3 free additional concurrent jobs for your open source projects.');
  });

  test('view billing tab when trial has ended', async function (assert) {
    this.subscription = null;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();
    let trial = this.server.create('trial', {
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
    assert.equal(profilePage.billing.trial.openSourceMessage.heading, '5 concurrent jobs, free!');
    assert.equal(profilePage.billing.trial.openSourceMessage.body, 'We <3 open source! You will always get 3 free additional concurrent jobs for your open source projects.');
  });

  test('view billing tab on education account', async function (assert) {
    this.subscription.plan = this.server.create('plan', { id: 'travis-ci-one-build', name: 'Bootstrap', builds: 1, price: 6900, currency: 'USD' });
    this.subscription.owner = this.organization;
    this.subscription.source = 'github';
    this.subscription.status = 'subscribed';
    this.subscription.save();
    this.organization.attrs.education = true;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    assert.equal(profilePage.billing.plan.name, 'Bootstrap plan education subscription');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('1 concurrent job');
  });


  test('view billing tab on educational account after subscribing to a plan', async function (assert) {
    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripev3', 'config', 'config:stripe');

    this.subscription = null;
    this.organization.attrs.education = true;
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();


    const { billingForm, selectedPlan, billingPaymentForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('john@doe.com');

    await billingForm.proceedPayment.click();


    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'john@doe.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, `${this.defaultV2Plan.name}`);
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

    await profilePage.billing.billingPlanChoices.lastBox.visit();
    assert.equal(profilePage.billing.selectedPlan.subscribeButton.text, 'Select plan');

    await profilePage.billing.selectedPlan.subscribeButton.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');
  });

  test('view billing tab shows plans selector when change plan button is clicked ', async function (assert) {
    this.subscription.destroy();

    await profilePage.visit();
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();
    await profilePage.billing.selectedPlan.subscribeButton.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    await profilePage.billing.selectedPlanOverview.changePlan.click();

    assert.ok(profilePage.billing.billingPlanChoices.isPresent);
    assert.ok(profilePage.billing.billingPlanChoices.isVisible);
  });

  test('apply 10 dollars off coupon', async function (assert) {
    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripev3', 'config', 'config:stripe');
    this.organization.permissions = {
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingCouponForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');

    await billingForm.proceedPayment.click();

    const coupon = this.coupons[1];
    const price = Math.floor(coupon.amountOff / 100);
    await billingCouponForm.fillIn('couponId', coupon.id);

    await billingCouponForm.submitCoupon.click();

    assert.equal(billingCouponForm.validCoupon.text, 'Coupon applied');
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${(this.defaultV2Plan.startingPrice / 100) - price}`);
  });

  test('apply coupon value higher than price', async function (assert) {
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
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingCouponForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');
    await billingForm.proceedPayment.click();

    const coupon = this.coupons[2];
    await billingCouponForm.fillIn('couponId', coupon.id);

    await billingCouponForm.submitCoupon.click();

    assert.equal(billingCouponForm.validCoupon.text, 'Coupon applied');
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${0}`);
  });

  skip('apply 10% off coupon', async function (assert) {
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
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingCouponForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis CI')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');
    await billingForm.proceedPayment.click();

    const coupon = this.coupons[0];
    await billingCouponForm.fillIn('couponId', coupon.id);

    await billingCouponForm.submitCoupon.click();

    const amountInDollars = this.defaultV2Plan.startingPrice / 100;
    const price = amountInDollars - (amountInDollars * coupon.percentOff) / 100;

    assert.equal(billingCouponForm.validCoupon.text, 'Coupon applied');
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${price}`);
  });

  test('apply invalid coupon', async function (assert) {
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
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingCouponForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis CI')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');

    await billingForm.proceedPayment.click();
    await billingCouponForm.fillIn('couponId', 'fake_id');
    await billingCouponForm.submitCoupon.click();

    assert.equal(billingCouponForm.invalidCoupon.text, 'Coupon invalid');

    const coupon = this.coupons[1];

    await billingCouponForm.fillIn('couponId', coupon.id);
    await billingCouponForm.submitCoupon.click();

    const price = Math.floor(coupon.amountOff / 100);

    assert.equal(billingCouponForm.validCoupon.text, 'Coupon applied');
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${(this.defaultV2Plan.startingPrice / 100) - price}`);
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

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingPaymentForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('john@doe.com');

    await billingForm.proceedPayment.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'john@doe.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, `${this.defaultV2Plan.name}`);
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
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingPaymentForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('john@doe.com');

    await billingForm.proceedPayment.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.equal(billingPaymentForm.contactDetails.email.text, 'john@doe.com');

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, `${this.defaultV2Plan.name}`);
  });

  test('create subscription with multiple emails', async function (assert) {
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
      createSubscription: true,
      plan_view: true,
      plan_create: true,
      billing_view: true,
      billing_update: true,
      plan_usage: true,
      plan_invoices: true,
      admin: true
    };
    this.organization.save();

    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.billing.visit();

    await profilePage.billing.billingPlanChoices.lastBox.visit();

    const { billingForm, selectedPlan, billingPaymentForm } = profilePage.billing;
    await selectedPlan.subscribeButton.click();

    await selectChoose(billingForm.billingSelectCountry.scope, 'Germany');

    await billingForm
      .fillIn('firstname', 'John')
      .fillIn('lastname', 'Doe')
      .fillIn('companyName', 'Travis')
      .fillIn('address', '15 Olalubi street')
      .fillIn('city', 'Berlin')
      .fillIn('zip', '353564')
      .fillIn('vat', '356463');

    await profilePage.billing.billingEmails.objectAt(0).fillEmail('joe@jane.com');

    await click(BILLING_INFO_ADD_EMAIL);
    await profilePage.billing.billingEmails.objectAt(1).fillEmail('jane@email.com');

    await click(BILLING_INFO_ADD_EMAIL);
    await profilePage.billing.billingEmails.objectAt(2).fillEmail('joe@email.com');

    await click(BILLING_INFO_ADD_EMAIL);
    await profilePage.billing.billingEmails.objectAt(3).fillEmail('doe@email.com');

    await billingForm.proceedPayment.click();

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.defaultV2Plan.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.credits.text, `${(this.defaultV2Plan.privateCredits * (this.defaultV2Plan.isAnnual ? 12 : 1)).toLocaleString()} Credits`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.defaultV2Plan.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.osscredits.text, `${(this.defaultV2Plan.publicCredits).toLocaleString()} OSS Only Credits/month`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.defaultV2Plan.startingUsers} unique users User licenses incl. in price: 0 User licenses at discounted credits price: 0 check pricing Users charged monthly per usage check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.equal(billingPaymentForm.contactDetails.contactHeading.text, 'contact details');
    assert.equal(billingPaymentForm.contactDetails.firstName.text, 'John Doe');
    assert.equal(billingPaymentForm.contactDetails.company.text, 'Travis');
    assert.dom(billingPaymentForm.contactDetails.email.scope).isVisible({ count: 4 });

    assert.equal(billingPaymentForm.contactDetails.billingHeading.text, 'billing details');
    assert.equal(billingPaymentForm.contactDetails.address.text, '15 Olalubi street');
    assert.equal(billingPaymentForm.contactDetails.city.text, 'Berlin');
    assert.equal(billingPaymentForm.contactDetails.country.text, 'Germany');

    assert.ok(billingPaymentForm.isPresent);

    await billingPaymentForm.completePayment.click();

    assert.equal(profilePage.billing.plan.name, `${this.defaultV2Plan.name}`);
  });

  test('view plan with manual subscription', async function (assert) {
    this.v2subscription = this.server.create('v2-subscription', {
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(),
      addons: [
        {name: 'User license addon', type: 'user_license', current_usage: {addon_usage: 1}}
      ],
      source: 'manual'
    });

    await profilePage.visit();
    await profilePage.billing.visit();

    assert.ok(profilePage.billing.planYellowMessage.isPresent);
    assert.ok(profilePage.billing.planManualMessage.isPresent);
  });
});
