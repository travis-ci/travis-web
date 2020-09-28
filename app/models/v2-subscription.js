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

  source: attr('string'),
  createdAt: attr('date'),
  organization: belongsTo('organization'),
  coupon: attr('string'),
  clientSecret: attr('string'),
  paymentIntent: attr('string'),

  discount: belongsTo('discount', { async: false }),
  billingInfo: belongsTo('v2-billing-info', { async: false }),
  creditCardInfo: belongsTo('v2-credit-card-info', { async: false }),
  invoices: hasMany('invoice'),
  owner: belongsTo('owner', { polymorphic: true }),
  plan: belongsTo('v2-plan-config'),
  addons: attr(),

  isStripe: equal('source', 'stripe'),
  isGithub: equal('source', 'github'),
  isManual: equal('source', 'manual'),

  usedUsers: computed('addons.[].current_usage', function () {
    if (!this.addons) {
      return 0;
    }
    return this.addons.reduce((processed, addon) => {
      if (addon.type === 'user_license') {
        processed += addon.current_usage.addon_usage;
      }

      return processed;
    }, 0);
  }),

  addonUsage: computed('addons.[].current_usage', function () {
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

  hasPublicCredits: computed('addonUsage.public.remainingCredits', function () {
    return this.addonUsage.public.remainingCredits > 0;
  }),

  hasPrivateCredits: computed('addonUsage.private.remainingCredits', function () {
    return this.addonUsage.public.remainingCredits > 0;
  }),

  priceInCents: reads('plan.startingPrice'),
  validateCouponResult: reads('validateCoupon.last.value'),

  planPrice: computed('priceInCents', function () {
    return this.priceInCents && Math.floor(this.priceInCents / 100);
  }),

  validateCoupon: task(function* (couponId) {
    return yield this.store.findRecord('coupon', couponId, {
      reload: true,
    });
  }).drop(),

  billingUrl: computed('owner.{type,login}', 'isGithub', function () {
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

  sourceWords: computed('source', function () {
    let source = this.source;
    return sourceToWords[source];
  }),

  chargeUnpaidInvoices: task(function* () {
    return yield this.api.post(`/v2_subscription/${this.id}/pay`);
  }).drop(),

  switchToFreeSubscription: task(function* (reason, details) {
    yield this.api.patch(`/v2_subscription/${this.id}/changetofree`, {
      data: { reason, reason_details: details }
    });
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  changePlan: task(function* (plan) {
    const data = { plan };
    yield this.api.patch(`/v2_subscription/${this.id}/plan`, { data });
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  buyAddon: task(function* (addon) {
    yield this.api.post(`/v2_subscription/${this.id}/addon/${addon.id}`);
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop()
});
