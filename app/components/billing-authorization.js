import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, not, equal, and } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import { computed } from '@ember/object';

export default Component.extend({
  plan: service(),
  stripe: service(),
  accounts: service(),

  stripeElement: null,
  account: null,
  subscription: null,

  showPlansSelector: false,
  showCancelModal: false,
  showMonthly: reads('plan.showMonthly'),
  displayedPlans: reads('plan.displayedPlans'),
  selectedPlan: reads('plan.selectedPlan'),
  showAnnual: reads('plan.showAnnual'),

  requiresSourceAction: equal('subscription.paymentIntent.status', 'requires_source_action'),
  requiresSource: equal('subscription.paymentIntent.status', 'requires_source'),
  lastPaymentIntentError: reads('subscription.paymentIntent.last_payment_error'),
  retryAuthorizationClientSecret: reads('subscription.paymentIntent.client_secret'),
  notChargeInvoiceSubscription: not('subscription.chargeUnpaidInvoices.lastSuccessful.value'),
  resubscribeLoading: reads('resubscribe.isRunning'),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  hasSubscriptionPermissions: reads('account.hasSubscriptionPermissions'),
  canCancelSubscription: and('isNotCanceled', 'hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'hasSubscriptionPermissions'),
  isCanceled: reads('subscription.isCanceled'),
  isNotCanceled: not('isCanceled'),

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
        yield this.subscription.creditCardInfo.updateToken(this.subscription.id, token);
        const { client_secret: clientSecret } = yield this.subscription.chargeUnpaidInvoices.perform();
        yield this.stripe.handleStripePayment.perform(clientSecret);
      }
    } catch (error) {
      this.flashes.error('An error occurred when creating your subscription. Please try again.');
    }
  }).drop(),

  editPlan: task(function* () {
    yield this.subscription.changePlan.perform({ plan: this.selectedPlan.id });
    yield this.accounts.fetchSubscriptions.perform();
    yield this.retryAuthorization.perform();
  }).drop(),

  resubscribe: task(function* () {
    yield this.subscription.resubscribe.perform();
    yield this.accounts.fetchSubscriptions.perform();
    yield this.retryAuthorization.perform();
  }).drop(),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
