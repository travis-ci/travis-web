import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, not, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  store: service(),
  accounts: service(),
  flashes: service(),
  metrics: service(),
  storage: service(),

  account: null,
  stripeElement: null,
  stripeLoading: false,
  couponId: null,
  options: config.stripeOptions,
  showSwitchToFreeModal: false,

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

  isNewSubscription: not('subscription.id'),

  coupon: reads('subscription.validateCoupon.last.value'),
  couponError: reads('subscription.validateCoupon.last.error'),
  isValidCoupon: reads('coupon.valid'),
  couponHasError: computed('couponError', {
    get() {
      return !!this.couponError;
    },
    set(key, value) {
      return value;
    }
  }),

  discountByAmount: computed('coupon.amountOff', 'selectedPlan.startingPrice', function () {
    const { amountOff } = this.coupon || {};
    return amountOff && this.selectedPlan.startingPrice && Math.max(0, this.selectedPlan.startingPrice - amountOff);
  }),

  discountByPercentage: computed('coupon.percentOff', 'selectedPlan.startingPrice', function () {
    const { percentOff } = this.coupon || {};
    if (percentOff && this.selectedPlan.startingPrice) {
      const discountPrice = Math.max(0, this.selectedPlan.startingPrice - (this.selectedPlan.startingPrice * percentOff) / 100);
      return +discountPrice.toFixed(2);
    }
  }),

  totalPrice: computed('discountByAmount', 'discountByPercentage', 'selectedPlan.startingPrice', function () {
    if (typeOf(this.discountByAmount) === 'number' && this.discountByAmount >= 0) {
      return this.discountByAmount;
    } else if (typeOf(this.discountByPercentage) === 'number' && this.discountByPercentage >= 0) {
      return this.discountByPercentage;
    } else {
      return this.selectedPlan.startingPrice;
    }
  }),

  creditCardInfo: reads('subscription.creditCardInfo'),
  creditCardInfoEmpty: computed('subscription.creditCardInfo', function () {
    return !this.creditCardInfo.lastDigits;
  }),

  updatePlan: task(function* () {
    if (this.selectedPlan.isFree) {
      this.set('showSwitchToFreeModal', true);
    } else {
      if (this.selectedAddon) {
        this.metrics.trackEvent({
          action: 'Buy Addon Pay Button Clicked',
          category: 'Subscription',
        });
        yield this.subscription.buyAddon.perform(this.selectedAddon);
      } else {
        if (!this.subscription.id && this.v1SubscriptionId) {
          this.metrics.trackEvent({
            action: 'Plan upgraded from Legacy Plan',
            category: 'Subscription',
          });
          const { account, subscription, selectedPlan } = this;
          const organizationId = account.type === 'organization' ? +(account.id) : null;
          const plan = selectedPlan && selectedPlan.id && this.store.peekRecord('v2-plan-config', selectedPlan.id);
          const org = organizationId && this.store.peekRecord('organization', organizationId);
          subscription.setProperties({
            organization: org,
            plan: plan,
            v1SubscriptionId: this.v1SubscriptionId,
          });
          const { clientSecret } = yield subscription.save();
          yield this.stripe.handleStripePayment.perform(clientSecret);
        } else {
          this.metrics.trackEvent({
            action: 'Change Plan Pay Button Clicked',
            category: 'Subscription',
          });
          yield this.subscription.changePlan.perform(this.selectedPlan.id);
        }
      }
      yield this.accounts.fetchV2Subscriptions.perform();
      yield this.retryAuthorization.perform();
      this.storage.clearBillingData();
      this.set('showPlansSelector', false);
      this.set('showAddonsSelector', false);
      this.set('isProcessCompleted', true);
    }
  }).drop(),

  createFreeSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Free Plan Chosen',
      category: 'Subscription',
    });
    const { account, subscription, selectedPlan } = this;
    try {
      const organizationId = account.type === 'organization' ? +(account.id) : null;
      const plan = selectedPlan && selectedPlan.id && this.store.peekRecord('v2-plan-config', selectedPlan.id);
      const org = organizationId && this.store.peekRecord('organization', organizationId);
      subscription.setProperties({
        organization: org,
        plan: plan,
      });
      yield subscription.save();
      yield this.accounts.fetchV2Subscriptions.perform();
      this.storage.clearBillingData();
      this.set('showPlansSelector', false);
      this.set('isProcessCompleted', true);
    } catch (error) {
      this.handleError();
    }
  }).drop(),

  createSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement, account, subscription, selectedPlan } = this;
    try {
      const { token } = yield this.stripe.createStripeToken.perform(stripeElement);
      if (token) {
        const organizationId = account.type === 'organization' ? +(account.id) : null;
        const plan = selectedPlan && selectedPlan.id && this.store.peekRecord('v2-plan-config', selectedPlan.id);
        const org = organizationId && this.store.peekRecord('organization', organizationId);
        subscription.setProperties({
          organization: org,
          plan: plan,
        });
        if (!this.subscription.id) {
          subscription.creditCardInfo.setProperties({
            token: token.id,
            lastDigits: token.card.last4
          });
          const { clientSecret } = yield subscription.save();
          yield this.stripe.handleStripePayment.perform(clientSecret);
        } else {
          yield this.subscription.creditCardInfo.updateToken.perform({
            subscriptionId: this.subscription.id,
            tokenId: token.id,
            tokenCard: token.card
          });
          yield subscription.save();
          yield subscription.changePlan.perform(selectedPlan.id);
          yield this.accounts.fetchV2Subscriptions.perform();
          yield this.retryAuthorization.perform();
        }
        this.metrics.trackEvent({ button: 'pay-button' });
        this.storage.clearBillingData();
        this.set('showPlansSelector', false);
        this.set('isProcessCompleted', true);
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
    this.flashes.error(message);
  },

  closeSwitchToFreeModal: function () {
    this.set('showSwitchToFreeModal', false);
    this.storage.clearBillingData();
    this.set('showPlansSelector', false);
    this.set('isProcessCompleted', true);
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
