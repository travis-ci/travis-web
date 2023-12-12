import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import { and, equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

let sourceToWords = {
  github: 'GitHub Marketplace',
  manual: 'manual',
  stripe: 'Stripe'
};

export default Model.extend({
  api: service(),
  accounts: service(),

  source: attr(),
  status: attr(),
  validTo: attr(),
  createdAt: attr('date'),
  permissions: attr(),
  organizationId: attr(),
  coupon: attr(),
  clientSecret: attr(),
  paymentIntent: attr(),
  planName: attr(),

  discount: belongsTo('discount', { async: false }),
  billingInfo: belongsTo('billing-info', { async: false }),
  creditCardInfo: belongsTo('credit-card-info', { async: false }),
  invoices: hasMany('invoice'),
  owner: belongsTo('owner', { polymorphic: true }),
  plan: belongsTo(),

  isSubscribed: equal('status', 'subscribed'),
  isCanceled: equal('status', 'canceled'),
  isExpired: equal('status', 'expired'),
  isPending: equal('status', 'pending'),
  isIncomplete: equal('status', 'incomplete'),
  isStripe: equal('source', 'stripe'),
  isGithub: equal('source', 'github'),
  isManual: equal('source', 'manual'),

  isNotSubscribed: or('isCanceled', 'isExpired'),
  managedSubscription: or('isStripe', 'isGithub'),
  isResubscribable: and('isStripe', 'isNotSubscribed'),
  isGithubResubscribable: and('isGithub', 'isNotSubscribed'),

  priceInCents: reads('plan.price'),
  validateCouponResult: reads('validateCoupon.last.value'),

  planPrice: computed('priceInCents', function () {
    return this.priceInCents && Math.floor(this.priceInCents / 100);
  }),

  discountByAmount: computed('validateCouponResult.amountOff', 'planPrice', function () {
    const { amountOff } = this.validateCouponResult || {};
    return amountOff && this.planPrice && Math.max(0, this.planPrice - Math.floor(amountOff / 100));
  }),

  discountByPercentage: computed('validateCouponResult.percentOff', 'planPrice', function () {
    const { percentOff } = this.validateCouponResult || {};
    if (percentOff && this.planPrice) {
      const discountPrice = Math.max(0, this.planPrice - (this.planPrice * percentOff) / 100);
      return +discountPrice.toFixed(2);
    }
  }),

  totalPrice: computed('discountByAmount', 'discountByPercentage', 'planPrice', function () {
    if (typeOf(this.discountByAmount) === 'number' && this.discountByAmount >= 0) {
      return this.discountByAmount;
    } else if (typeOf(this.discountByPercentage) === 'number' && this.discountByPercentage >= 0) {
      return this.discountByPercentage;
    } else {
      return this.planPrice;
    }
  }),

  validateCoupon: task(function* (couponId) {
    return yield this.store.findRecord('coupon', couponId, {
      reload: true,
    });
  }).drop(),

  billingUrl: computed('owner.{type,login}', 'isGithub', 'isResubscribable', function () {
    let type = this.get('owner.type');
    let login = this.get('owner.login');
    let isGithub = this.isGithub;

    const id = type === 'user' ? 'user' : login;

    if (isGithub) {
      return config.marketplaceEndpoint;
    } else {
      return `${config.billingEndpoint}/subscriptions/${id}`;
    }
  }),

  activeManagedSubscription: computed('isStripe', 'isGithub', 'isSubscribed', function () {
    let isStripe = this.isStripe;
    let isGithub = this.isGithub;
    let isSubscribed = this.isSubscribed;
    return ((isStripe || isGithub) && isSubscribed);
  }),

  sourceWords: computed('source', function () {
    let source = this.source;
    return sourceToWords[source];
  }),

  manualSubscriptionExpired: computed('isManual', 'validTo', function () {
    let isManual = this.isManual;
    let validTo = this.validTo;
    let today = new Date().toISOString();
    let date = Date.parse(today);
    let validToDate = Date.parse(validTo);
    return (isManual && (date > validToDate));
  }),

  chargeUnpaidInvoices: task(function* () {
    return yield this.api.post(`/subscription/${this.id}/pay`);
  }).drop(),

  cancelSubscription: task(function* (data) {
    yield this.api.post(`/subscription/${this.id}/cancel`, {
      data
    });
    yield this.accounts.fetchSubscriptions.perform();
  }).drop(),

  changePlan: task(function* (plan) {
    const data = { plan };
    yield this.api.patch(`/subscription/${this.id}/plan`, { data });
    yield this.accounts.fetchSubscriptions.perform();
  }).drop(),

  resubscribe: task(function* () {
    return yield this.api.patch(`/subscription/${this.id}/resubscribe`);
  }).drop(),
});
