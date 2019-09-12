import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, not, and, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

export default Component.extend({
  plan: service(),
  stripe: service(),
  accounts: service(),

  subscription: null,
  stripeElement: null,
  account: null,
  showPlansSelector: false,
  showCancelModal: false,

  showMonthly: reads('plan.showMonthly'),
  displayedPlans: reads('plan.displayedPlans'),
  selectedPlan: reads('plan.selectedPlan'),
  showAnnual: reads('plan.showAnnual'),
  isEditPlanLoading: reads('subscription.changePlan.isLoading'),

  isCanceled: reads('subscription.isCanceled'),
  isIncomplete: reads('subscription.isIncomplete'),
  isExpired: reads('subscription.isExpired'),
  isPending: reads('subscription.isPending'),
  resubscribe: reads('subscription.resubscribe'),
  resubscribeLoading: reads('subscription.resubscribe.isRunning'),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('isExpired'),
  isComplete: not('isIncomplete'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  showBillingInfo: and('subscription.isStripe', 'isCompleteAndNotExpired'),
  canCancelSubscription: and('isNotCanceled', 'account.hasSubscriptionPermissions'),
  canChangePlan: reads('account.hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'account.hasSubscriptionPermissions'),
  retryAuthorizationClientSecret: reads('subscription.paymentIntent.client_secret'),
  notChargeInvoiceSubscription: not('subscription.chargeUnpaidInvoices.lastSuccessful.value'),
  requiresSourceAction: equal('subscription.paymentIntent.status', 'requires_source_action'),
  requiresSource: equal('subscription.paymentIntent.status', 'requires_source'),
  lastPaymentIntentError: reads('subscription.paymentIntent.last_payment_error'),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  handleError: reads('stripe.handleError'),
  options: config.stripeOptions,

  stripeErrorMessage: computed('lastPaymentIntentError', function () {
    if (this.lastPaymentIntentError) {
      return this.handleError(this.lastPaymentIntentError);
    }
  }),

  editPlan: task(function* () {
    yield this.subscription.changePlan.perform({
      plan: this.selectedPlan.id
    });
  }).drop(),

  retryAuthorization: task(function* () {
    if (this.requiresSourceAction && this.retryAuthorizationClientSecret) {
      yield this.stripe.handleStripePayment.perform(this.retryAuthorizationClientSecret);
      yield this.accounts.fetchSubscriptions.perform();
    }
  }).drop(),

  retryPayment: task(function* () {
    const { token } = yield this.stripe.createStripeToken.perform(this.stripeElement);
    try {
      if (token) {
        yield this.subscription.creditCardInfo.updateToken(this.subscription.id, token);
        const { client_secret: clientSecret } = yield this.subscription.chargeUnpaidInvoices.perform();
        yield this.stripe.handleStripePayment.perform(clientSecret);
        yield this.accounts.fetchSubscriptions.perform();
      }
    } catch (error) {
      this.flashes.error('An error occurred when creating your subscription. Please try again.');
    }
  }).drop(),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
