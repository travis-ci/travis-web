import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, reads, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  accounts: service(),
  flashes: service(),
  metrics: service(),
  storage: service(),
  config,

  account: null,
  stripeElement: null,
  stripeLoading: false,
  newSubscription: null,
  couponId: null,
  isDisclaimerChecked: false,
  options: config.stripeOptions,

  shouldNotCreateSubscription: not('isDisclaimerChecked'),
  firstName: reads('newSubscription.billingInfo.firstName'),
  lastName: reads('newSubscription.billingInfo.lastName'),
  company: reads('newSubscription.billingInfo.company'),
  email: reads('newSubscription.billingInfo.billingEmail'),
  address: reads('newSubscription.billingInfo.address'),
  city: reads('newSubscription.billingInfo.city'),
  country: reads('newSubscription.billingInfo.country'),
  isLoading: or('createSubscription.isRunning', 'accounts.fetchSubscriptions.isRunning'),
  selectedPlan: reads('newSubscription.plan'),

  coupon: reads('newSubscription.validateCoupon.last.value'),
  couponError: reads('newSubscription.validateCoupon.last.error'),
  totalPrice: reads('newSubscription.totalPrice'),
  isValidCoupon: reads('coupon.valid'),
  couponHasError: computed('couponError', {
    get() {
      return !!this.couponError;
    },
    set(key, value) {
      return value;
    }
  }),

  createSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement, account, newSubscription, selectedPlan } = this;
    try {
      const { token, error } = yield this.stripe.createStripeToken.perform(stripeElement);
      if (!error && token && token.card) {
        const organizationId = account.type === 'organization' ? +(account.id) : null;
        newSubscription.creditCardInfo.setProperties({
          token: token.id,
          lastDigits: token.card.last4
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

  handleCreateSubscription: task(function* () {
    if (this.isDisclaimerChecked) {
      yield this.createSubscription.perform();
    }
  }).drop(),

  validateCoupon: task(function* () {
    try {
      yield this.newSubscription.validateCoupon.perform(this.couponId);
    } catch { }
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
      this.flashes.clear();
    },

    handleCouponFocus() {
      this.set('couponHasError', false);
    }
  }
});
