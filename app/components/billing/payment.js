import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, reads } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service('stripe'),
  accounts: service('accounts'),
  flashes: service('flashes'),
  metrics: service('metrics'),

  account: null,
  stripeElement: null,
  stripeLoading: false,
  newSubscription: null,
  couponId: null,
  options: config.stripeOptions,

  firstName: reads('newSubscription.billingInfo.firstName'),
  lastName: reads('newSubscription.billingInfo.lastName'),
  company: reads('newSubscription.billingInfo.company'),
  email: reads('newSubscription.billingInfo.billingEmail'),
  address: reads('newSubscription.billingInfo.address'),
  city: reads('newSubscription.billingInfo.city'),
  country: reads('newSubscription.billingInfo.country'),
  isLoading: or('createSubscription.isRunning', 'accounts.fetchSubscriptions.isRunning'),

  coupon: reads('newSubscription.validateCoupon.lastSuccessful.value'),
  couponError: reads('newSubscription.validateCoupon.lastErrored.error'),
  totalPrice: reads('newSubscription.totalPrice'),
  isValidCoupon: reads('coupon.valid'),

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
    yield this.newSubscription.validateCoupon.perform(this.couponId);
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
