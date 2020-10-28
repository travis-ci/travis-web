import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, not, equal, and, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import { computed } from '@ember/object';

export default Component.extend({
  stripe: service(),
  accounts: service(),
  store: service(),

  stripeElement: null,
  account: null,
  subscription: null,

  showCancelModal: false,
  isV2Subscription: false,
  selectedPlan: null,
  selectedAddon: null,

  requiresSourceAction: equal('subscription.paymentIntent.status', 'requires_source_action'),
  requiresSource: equal('subscription.paymentIntent.status', 'requires_source'),
  lastPaymentIntentError: reads('subscription.paymentIntent.last_payment_error'),
  retryAuthorizationClientSecret: reads('subscription.paymentIntent.client_secret'),
  hasSubscriptionPermissions: reads('account.hasSubscriptionPermissions'),
  notChargeInvoiceSubscription: not('subscription.chargeUnpaidInvoices.lastSuccessful.value'),
  isSubscribed: reads('subscription.isSubscribed'),
  isIncomplete: reads('subscription.isIncomplete'),
  isComplete: not('isIncomplete'),
  canCancelSubscription: and('isSubscribed', 'hasSubscriptionPermissions'),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  isLoading: or('accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning',
    'cancelSubscriptionLoading', 'editPlan.isRunning', 'resubscribe.isRunning'),

  freeV2Plan: equal('subscription.plan.startingPrice', 0),
  canBuyAddons: not('freeV2Plan'),

  handleError: reads('stripe.handleError'),
  options: config.stripeOptions,

  stripeErrorMessage: computed('lastPaymentIntentError', function () {
    if (this.lastPaymentIntentError) {
      return this.handleError(this.lastPaymentIntentError);
    }
  }),

  retryAuthorization: task(function* () {
    if (this.requiresSourceAction && this.retryAuthorizationClientSecret) {
      yield this.stripe.handleStripePayment.perform(this.retryAuthorizationClientSecret);
    }
  }).drop(),

  retryPayment: task(function* () {
    const { token } = yield this.stripe.createStripeToken.perform(this.stripeElement);
    try {
      if (token) {
        yield this.subscription.creditCardInfo.updateToken.perform({
          subscriptionId: this.subscription.id,
          tokenId: token.id,
          tokenCard: token.card
        });
        const { client_secret: clientSecret } = yield this.subscription.chargeUnpaidInvoices.perform();
        yield this.stripe.handleStripePayment.perform(clientSecret);
        yield this.accounts.fetchV2Subscriptions.perform();
      }
    } catch (error) {
      this.flashes.error('An error occurred when creating your subscription. Please try again.');
    }
  }).drop(),

  editPlan: task(function* () {
    yield this.subscription.changePlan.perform(this.selectedPlan.id);
    yield this.accounts.fetchSubscriptions.perform();
    yield this.accounts.fetchV2Subscriptions.perform();
    yield this.retryAuthorization.perform();
  }).drop(),

  resubscribe: task(function* () {
    const result = yield this.subscription.resubscribe.perform();
    if (result.payment_intent && result.payment_intent.client_secret) {
      yield this.stripe.handleStripePayment.perform(result.payment_intent.client_secret);
    } else {
      yield this.accounts.fetchSubscriptions.perform();
      yield this.accounts.fetchV2Subscriptions.perform();
    }
  }).drop(),

  newV2Subscription: computed(function () {
    const plan = this.store.createRecord('v2-plan-config');
    const billingInfo = this.store.createRecord('v2-billing-info');
    const creditCardInfo = this.store.createRecord('v2-credit-card-info');
    billingInfo.setProperties({
      firstName: this.subscription.billingInfo.firstName,
      lastName: this.subscription.billingInfo.lastName,
      address: this.subscription.billingInfo.address,
      city: this.subscription.billingInfo.city,
      zipCode: this.subscription.billingInfo.zipCode,
      country: this.subscription.billingInfo.country,
      billingEmail: this.subscription.billingInfo.billingEmail
    });
    creditCardInfo.setProperties({
      token: 'token',
      lastDigits: this.subscription.creditCardInfo.lastDigits
    });
    return this.store.createRecord('v2-subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  }),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
