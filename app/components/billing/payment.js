import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, reads, not } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  accounts: service(),
  flashes: service(),
  raven: service(),
  metrics: service(),
  api: service(),

  account: null,
  stripeElement: null,
  stripeLoading: false,
  newSubscription: null,
  options: config.stripeOptions,

  firstName: reads('newSubscription.billingInfo.firstName'),
  lastName: reads('newSubscription.billingInfo.lastName'),
  company: reads('newSubscription.billingInfo.company'),
  email: reads('newSubscription.billingInfo.billingEmail'),
  address: reads('newSubscription.billingInfo.address'),
  city: reads('newSubscription.billingInfo.city'),
  country: reads('newSubscription.billingInfo.country'),
  isLoading: or('createSubscription.isRunning', 'accounts.fetchSubscriptions.isRunning'),
  couponResult: null,
  isValidCoupon: reads('couponResult.valid'),
  isInvalidCoupon: not('couponResult.valid'),

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
        newSubscription.setProperties({ organizationId, plan: selectedPlan });
        const { clientSecret } = yield newSubscription.save();
        this.metrics.trackEvent({ button: 'pay-button' });
        yield this.stripe.handleStripePayment.perform(clientSecret);
      }
    } catch (error) {
      this.handleError();
    }
  }).drop(),

  validateCoupon: task(function* () {
    try {
      const result = yield this.api.get(`/coupons/${this.coupon}`);
      this.set('couponResult', result);
      this.set('isValidCoupon', result.valid);
    } catch (error) {
      const { error_type: errorType } = error.responseJSON;
      if (errorType === 'not_found') {
        this.set('couponResult', error.responseJSON);
        this.set('isValidCoupon', false);
      } else {
        this.raven.logException('Coupon validation error');
      }
    }
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
  }
});
