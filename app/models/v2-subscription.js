import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { equal, reads } from '@ember/object/computed';
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
  createdAt: attr('date'),
  permissions: computed('', () => ({ write: true, read: true })),
  organizationId: attr(),
  coupon: attr(),
  clientSecret: attr(),
  paymentIntent: attr(),

  discount: belongsTo('discount', { async: false }),
  billingInfo: belongsTo('v2-billing-info', { async: false }),
  creditCardInfo: belongsTo('v2-credit-card-info', { async: false }),
  invoices: hasMany('v2-invoice'),
  owner: belongsTo('owner', { polymorphic: true }),
  plan: belongsTo('v2-plan-config'),
  addons: attr(),

  isStripe: equal('source', 'stripe'),
  isGithub: equal('source', 'github'),
  isManual: equal('source', 'manual'),

  addonUsage: computed('addons', function () {
    if (!this.addons) {
      const emptyUsage = { totalCredits: 0, usedCredits: 0, remainingCredits: 0 };
      return {
        public: emptyUsage,
        private: emptyUsage
      };
    }
    const publicUsages = this.addons.reduce((processed, addon) => {
      if (addon.type === 'credit_public') {
        processed.totalCredits += addon.current_usage.addon_quantity;
        processed.usedCredits += addon.current_usage.addon_usage;
        processed.remainingCredits += addon.current_usage.remaining;
      }

      return processed;
    }, {
      totalCredits: 0,
      usedCredits: 0,
      remainingCredits: 0,
    });
    const privateUsages = this.addons.reduce((processed, addon) => {
      if (addon.type === 'credit_private') {
        processed.totalCredits += addon.current_usage.addon_quantity;
        processed.usedCredits += addon.current_usage.addon_usage;
        processed.remainingCredits += addon.current_usage.remaining;
      }

      return processed;
    }, {
      totalCredits: 0,
      usedCredits: 0,
      remainingCredits: 0,
    });

    return {
      public: publicUsages,
      private: privateUsages
    };
  }),

  priceInCents: reads('plan.starting_price'),
  validateCouponResult: reads('validateCoupon.last.value'),

  planPrice: computed('priceInCents', function () {
    return this.priceInCents && Math.floor(this.priceInCents / 100);
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
      return `${config.billingEndpoint}/v2_subscriptions/${id}`;
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
    return yield this.api.post(`/v2_subscription/${this.id}/pay`);
  }).drop(),

  cancelSubscription: task(function* (data) {
    yield this.api.post(`/v2_subscription/${this.id}/cancel`, {
      data
    });
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  changePlan: task(function* (data) {
    yield this.api.patch(`/v2_subscription/${this.id}/plan`, {
      data
    });
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  resubscribe: task(function* () {
    return yield this.api.patch(`/v2_subscription/${this.id}/resubscribe`);
  }).drop(),
});
