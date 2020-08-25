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
    const { stripeElement, subscription, selectedPlan } = this;
    try {
      const { token } = yield this.stripe.createStripeToken.perform(stripeElement);
      if (token) {
        subscription.creditCardInfo.setProperties({
          token: token.id,
          lastDigits: token.card.last4
        });
        yield subscription.save();
        yield subscription.changePlan.perform({ plan: selectedPlan.id });
        yield this.accounts.fetchSubscriptions.perform();
        this.metrics.trackEvent({ button: 'pay-button' });
        this.storage.clearBillingData();
        this.set('showPlansSelector', false);
      }
    } catch (error) {
      this.handleError();
    }
  }).drop(),

  validateCoupon: task(function* () {
    try {
      yield this.subscription.validateCoupon.perform(this.couponId);
    } catch {}
  }).drop(),

  handleError() {
    let message = 'An error occurred when creating your subscription. Please try again.';
    const subscriptionErrors = this.subscription.errors;
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
    },

    clearCreditCardData() {
      this.subscription.set('creditCardInfo', null);
    }
  }
});
