import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  accounts: service(),
  flashes: service(),
  metrics: service(),
  storage: service(),

  account: null,
  stripeElement: null,
  stripeLoading: false,
  newSubscription: null,
  couponId: null,
  options: config.stripeOptions,

  firstName: reads('subscription.billingInfo.firstName'),
  lastName: reads('subscription.billingInfo.lastName'),
  company: reads('subscription.billingInfo.company'),
  billingEmail: reads('subscription.billingInfo.billingEmail'),
  billingEmails: computed('billingEmail', function () {
    return (this.billingEmail || '').split(',');
  }),

  address: reads('subscription.billingInfo.address'),
  city: reads('subscription.billingInfo.city'),
  country: reads('subscription.billingInfo.country'),
  isLoading: or('createSubscription.isRunning', 'accounts.fetchSubscriptions.isRunning', 'updatePlan.isRunning'),

  coupon: reads('subscription.validateCoupon.last.value'),
  couponError: reads('subscription.validateCoupon.last.error'),
  totalPrice: reads('subscription.totalPrice'),
  isValidCoupon: reads('coupon.valid'),
  couponHasError: computed('couponError', {
    get() {
      return !!this.couponError;
    },
    set(key, value) {
      return value;
    }
  }),

  creditCardInfoExists: reads('subscription.creditCardInfo.isValid'),

  updatePlan: task(function* () {
    yield this.subscription.changePlan.perform({ plan: this.selectedPlan.id });
    yield this.accounts.fetchSubscriptions.perform();
    yield this.retryAuthorization.perform();
    this.storage.clearBillingData();
    this.set('showPlansSelector', false);
  }).drop(),

  createSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement, account, newSubscription, selectedPlan } = this;
    try {
      const {
        token: { id, card },
        error
      } = yield this.stripe.createStripeToken.perform(stripeElement);
      if (!error) {
        const organizationId = account.type === 'organization' ? +(account.id) : null;
        newSubscription.creditCardInfo.setProperties({
          token: id,
          lastDigits: card.last4
        });
        newSubscription.setProperties({
          organizationId,
          plan: selectedPlan,
          coupon: this.isValidCoupon ? this.couponId : null
        });
        const { clientSecret } = yield newSubscription.save();
        this.metrics.trackEvent({ button: 'pay-button' });
        yield this.stripe.handleStripePayment.perform(clientSecret);
        this.storage.clearBillingData();
      }
    } catch (error) {
      this.handleError();
    }
  }).drop(),

  validateCoupon: task(function* () {
    try {
      yield this.newSubscription.validateCoupon.perform(this.couponId);
    } catch {}
  }).drop(),

  handleError() {
    let message = 'An error occurred when creating your subscription. Please try again.';
    const subscriptionErrors = this.newSubscription.errors;
    if (subscriptionErrors && subscriptionErrors.get('validationErrors').length > 0) {
      const validationError = subscriptionErrors.get('validationErrors')[0];
      message = validationError.message;
    }
    this.flashes.error(message);
  },

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },

    handleCouponFocus() {
      this.set('couponHasError', false);
    }
  }
});
