import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { empty, not, reads, and } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { underscore } from '@ember/string';
import { countries, states, stateCountries, nonZeroVatThresholdCountries, zeroVatThresholdCountries } from 'travis/utils/countries';

export default Component.extend({
  api: service(),
  stripe: service(),
  store: service(),
  flashes: service(),
  metrics: service(),

  countries,

  model: reads('activeModel'),
  states: computed('country', function () {
    const { country } = this;

    return states[country];
  }),
  account: null,
  stripeElement: null,
  stripeLoading: false,
  couponId: null,
  options: computed('disableForm', function () {
    let configStripe = config.stripeOptions;
    configStripe['disabled'] = this.get('disableForm');
    return configStripe;
  }),
  showSwitchToFreeModal: false,
  showPlanSwitchWarning: false,

  v1subscription: reads('account.subscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('v2subscription'),
  isSubscriptionEmpty: empty('v1subscription'),
  isSubscriptionsEmpty: and('isSubscriptionEmpty', 'isV2SubscriptionEmpty'),
  canViewBilling: computed('model', function () {
    return !this.account.isOrganization || this.account.permissions.billing_view;
  }),
  canEditBilling: computed('model', function () {
    return !this.account.isOrganization || this.account.permissions.billing_update;
  }),
  hasV2Subscription: not('isV2SubscriptionEmpty'),
  subscription: computed('v1subscription', 'v2subscription', function () {
    return this.isV2SubscriptionEmpty ? this.get('v1subscription') : this.get('v2subscription');
  }),
  invoices: computed('v1subscription.id', 'v2subscription.id', function () {
    const subscriptionId = this.isV2SubscriptionEmpty ? this.get('v1subscription.id') : this.get('v2subscription.id');
    const type = this.isV2SubscriptionEmpty ? 1 : 2;
    if (subscriptionId) {
      return this.store.query('invoice', { type, subscriptionId });
    } else {
      return [];
    }
  }),

  disableForm: computed('account.allowance.paymentChangesBlockCredit', 'account.allowance.paymentChangesBlockCaptcha', function () {
    const paymentChangesBlockCredit = this.account.allowance.get('paymentChangesBlockCredit');
    const paymentChangesBlockCaptcha = this.account.allowance.get('paymentChangesBlockCaptcha');
    return paymentChangesBlockCaptcha || paymentChangesBlockCredit;
  }),

  subscriptionLoaded: computed('subscription', function () {
    return !!this.subscription;
  }),

  billingInfo: computed('subscription', 'subscription.billingInfo', function () {
    return this.subscription ? this.subscription.get('billingInfo') : null;
  }),

  country: reads('billingInfo.country'),
  hasLocalRegistration: reads('billingInfo.hasLocalRegistration'),

  isLoading: reads('updatePaymentDetails.isRunning'),

  updatePaymentDetails: task(function* (reCaptchaResponse) {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement } = this;
    const subscription = this.subscription;
    try {
      let token = null;
      if (stripeElement) {
        let res = yield this.stripe.createStripeToken.perform(stripeElement);
        token = res.token;
      }
      const changedInfoAttrs = this.billingInfo.changedAttributes();
      let paymentDetails = {};
      paymentDetails['captcha_token'] = reCaptchaResponse;
      Object.keys(changedInfoAttrs).forEach(key => {
        paymentDetails[underscore(key)] = changedInfoAttrs[key][1];
      });
      if (token) {
        paymentDetails['token'] = token.id;
        paymentDetails['fingerprint'] = token.card.fingerprint;
      }
      const endpoint = this.isV2SubscriptionEmpty ? 'subscription' : 'v2_subscription';
      yield this.api.patch(`/${endpoint}/${subscription.id}/payment_details`, {
        data: paymentDetails
      });
      if (stripeElement) {
        this.stripeElement.clear();
        this.set('stripeElement', null);
      }
      this.flashes.success('Successfully updated payment information.');
      this.billingInfo.save();
    } catch (error) {
      if (typeof(error.json) === 'function') {
        const err = yield error.json();
        this.account.allowance.reload();
        this.flashes.error(err['error_message']);
      } else {
        this.flashes.error('An error occurred while updating payment information.');
      }
      yield this.billingInfo.reload();
    }
  }).drop(),

  isZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && zeroVatThresholdCountries.includes(country);
  }),

  isNonZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && nonZeroVatThresholdCountries.includes(country);
  }),

  isStateCountry: computed('country', function () {
    const { country } = this;

    return !!country && stateCountries.includes(country);
  }),

  isVatMandatory: computed('isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { isNonZeroVatThresholdCountry, isZeroVatThresholdCountry, hasLocalRegistration } = this;
    return isZeroVatThresholdCountry || (isNonZeroVatThresholdCountry ? hasLocalRegistration : false);
  }),

  showNonZeroVatConfirmation: reads('isNonZeroVatThresholdCountry'),

  showVatField: computed('country', 'isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { country, isNonZeroVatThresholdCountry, hasLocalRegistration } = this;
    return country && (isNonZeroVatThresholdCountry ? hasLocalRegistration : true);
  }),

  isStateMandatory: reads('isStateCountry'),

  enableSubmit: computed('stripeElement', 'billingInfo.hasDirtyAttributes', function () {
    return this.stripeElement || (this.billingInfo && this.billingInfo.hasDirtyAttributes);
  }),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
    onCaptchaResolved(reCaptchaResponse) {
      this.updatePaymentDetails.perform(reCaptchaResponse);
    },
    submit() {
      if (!this.enableSubmit || this.disableForm) return;
      window.grecaptcha.execute();
    }
  }
});
