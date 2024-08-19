import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, not, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import { computed } from '@ember/object';

export default Component.extend({
  stripe: service(),
  accounts: service(),
  store: service(),
  flashes: service(),

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
  notChargeInvoiceSubscription: not('subscription.chargeUnpaidInvoices.lastSuccessful.value'),
  freeV2Plan: equal('subscription.plan.startingPrice', 0),
  isSubscribed: reads('subscription.isSubscribed'),
  isIncomplete: reads('subscription.isIncomplete'),
  isComplete: not('isIncomplete'),
  isExpired: or('subscription.isExpired', 'subscription.subscriptionExpiredByDate'),
  cancellationRequested: reads('subscription.cancellationRequested'),
  canCancelSubscription: computed('isSubscribed', 'hasSubscriptionPermissions', 'freeV2Plan', 'isTrial', 'cancellationRequested', function () {
    return this.isSubscribed && this.hasSubscriptionPermissions && !this.freeV2Plan && !this.isTrial && !this.cancellationRequested;
  }),

  hasSubscriptionPermissions: computed('account.hasSubscriptionPermissions', 'account.permissions', function () {
    return this.account.hasSubscriptionPermissions && (!this.account.isOrganization || this.account.permissions.plan_create);
  }),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  isTrial: reads('subscription.plan.isTrial'),
  isLoading: or('accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning',
    'cancelSubscriptionLoading', 'editPlan.isRunning', 'resubscribe.isRunning'),

  canBuyAddons: computed('freeV2Plan', 'subscription.isCanceled', 'isTrial', 'isExpired',
    'cancellationRequested', 'isSubscribed', function () {
      return !this.freeV2Plan && !this.subscription.isCanceled &&
           !this.isTrial && !this.cancellationRequested &&
        !this.isExpired && this.isSubscribed;
    }),

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

  cancelSubscription: task(function* () {
    try {
      this.flashes.successWithClose(
        'Your cancellation request has been forwarded to Support. Our Support team will contact you soon. ' +
        'Please turn off auto-refill if you don\'t plan to use it anymore.',
        'We’re sorry to see you go'
      );
      yield this.subscription.cancelSubscription.perform();
      // this.set('showCancelModal', true);
    } catch (error) {
      this.flashes.error('An error occurred when submitting your cancellation request. Please try again.');
    }
  }).drop(),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
