import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { equal, not, reads, or, alias } from '@ember/object/computed';
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
  status: attr('string'),
  createdAt: attr('date'),
  validTo: attr('date'),
  organization: belongsTo('organization',  { async: false, inverse: null }),
  coupon: attr('string'),
  clientSecret: attr('string'),
  paymentIntent: attr(),
  scheduledPlanName: attr('string'),
  cancellationRequested: attr('boolean'),
  canceledAt: attr('date'),
  sharedBy: attr(),

  v1SubscriptionId: attr('number'),

  discount: belongsTo('discount', { async: false, inverse: null }),
  billingInfo: belongsTo('v2-billing-info', { async: false, inverse: 'subscription' }),
  creditCardInfo: belongsTo('v2-credit-card-info', { async: false, inverse: 'subscription' }),
  invoices: hasMany('invoice', { async: false, inverse: 'subscription'}),
  owner: belongsTo('owner', { polymorphic: true, async: true, inverse: null }),
  plan: belongsTo('v2-plan-config', {async: false, inverse: null}),
  addons: attr(),
  auto_refill: attr(),
  current_trial: attr(),
  deferPause: attr(),
  planShares: attr(),

  isCanceled: equal('status', 'canceled'),
  isExpired: equal('status', 'expired'),
  isPending: equal('status', 'pending'),
  isIncomplete: equal('status', 'incomplete'),

  isStripe: equal('source', 'stripe'),
  isGithub: equal('source', 'github'),
  isManual: equal('source', 'manual'),
  isNotManual: not('isManual'),

  subscriptionExpiredByDate: computed('validTo', function () {
    let validTo = this.validTo;
    let today = new Date().toISOString();
    let date = Date.parse(today);
    let validToDate = Date.parse(validTo);
    return date > validToDate;
  }),

  isSubscribed: computed('status', function () {
    return this.status === null || this.status == 'subscribed';
  }),

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
    const addonReduce = (type) => (processed, addon) => {
      if (addon.type === type) {
        processed.totalCredits += addon.current_usage.addon_quantity;
        processed.usedCredits += addon.current_usage.addon_usage;
        processed.remainingCredits += addon.current_usage.remaining;
        const validDate = Date.parse(addon.current_usage.valid_to);
        const purchaseDate = Date.parse(addon.current_usage.purchase_date);
        processed.validDate = validDate;
        processed.purchaseDate = purchaseDate;
      }
      return processed;
    };
    const publicUsages = this.addons.reduce(addonReduce('credit_public'), {
      validDate: Date.now(),
      purchaseDate: Date.now(),
      totalCredits: 0,
      usedCredits: 0,
      remainingCredits: 0,
    });
    const privateUsages = this.addons.reduce(addonReduce('credit_private'), {
      validDate: Date.now(),
      purchaseDate: Date.now(),
      totalCredits: 0,
      usedCredits: 0,
      remainingCredits: 0,
    });
    const userLicense = this.addons.reduce(addonReduce('user_license'), {
      validDate: Date.now(),
      purchaseDate: Date.now(),
      totalCredits: 0,
      usedCredits: 0,
      remainingCredits: 0,
    });

    return {
      public: publicUsages,
      private: privateUsages,
      user: userLicense
    };
  }),

  recurringAddon: computed('addons.[]', function () {
    const recurringAddons = this.addons.filter(addon => addon.recurring);
    return recurringAddons ? recurringAddons[0] : null;
  }),

  validToFromAddon: computed('addons.[]', function () {
    const addons = this.addons.filter(addon => (addon.type === 'user_license' || addon.recurring) && addon.current_usage.status !== 'expired');
    const addon =  addons ? addons[0] : null;
    if (addon) {
      return addon.current_usage.valid_to;
    }
  }),

  hasPublicCredits: computed('addonUsage.public.remainingCredits', function () {
    return this.addonUsage.public.remainingCredits > 0;
  }),

  hasPrivateCredits: computed('addonUsage.private.remainingCredits', function () {
    return this.addonUsage.public.remainingCredits > 0;
  }),

  hasCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addons.filter(addon => addon.type === 'credit_private').length > 0;
  }),
  hasOSSCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addons.filter(addon => addon.type === 'credit_public').length > 0;
  }),
  hasUserLicenseAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addons.filter(addon => addon.type === 'user_license').length > 0;
  }),
  hasCredits: or('hasCreditAddons', 'hasOSSCreditAddons'),

  isNotGithubOrManual: computed('source', function () {
    return this.source !== 'github' && this.source !== 'manual';
  }),

  priceInCents: reads('plan.planPrice'),
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

  account: alias('accounts.user'),
  availablePlans: reads('account.eligibleV2Plans'),

  scheduledPlan: computed('scheduledPlanName', 'availablePlans', function () {
    if (!this.availablePlans) {
      return null;
    }

    return this.availablePlans.filter(plan => plan.id === this.scheduledPlanName)[0];
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

  shareMultiple: task(function* (receivers, value) {
    for (let receiverId of receivers) {
      const data = { receiver_id: receiverId };
      if (value) {
        yield this.api.post(`/v2_subscription/${this.id}/share`, { data });
      } else {
        yield this.api.delete(`/v2_subscription/${this.id}/share`, { data });
      }
    }
    yield this.accounts.fetchV2Subscriptions.linked().perform();
  }).drop(),

  share: task(function* (receiverId) {
    const data = { receiver_id: receiverId };
    yield this.api.post(`/v2_subscription/${this.id}/share`, { data });
    yield this.accounts.fetchV2Subscriptions.linked().perform();
  }).drop(),

  delete_share: task(function* (receiverId) {
    const data = { receiver_id: receiverId };
    yield this.api.delete(`/v2_subscription/${this.id}/share`, { data });
    yield this.accounts.fetchV2Subscriptions.linked().perform();
  }).drop(),

  changePlan: task(function* (plan, coupon) {
    const data = { plan, coupon };
    yield this.api.patch(`/v2_subscription/${this.id}/plan`, { data });
    this.accounts.fetchV2Subscriptions.linked().perform();
  }).drop(),

  buyAddon: task(function* (addon) {
    yield this.api.post(`/v2_subscription/${this.id}/addon/${addon.id}`);
    this.accounts.fetchV2Subscriptions.linked().perform();
  }).drop(),

  autoRefillToggle: task(function* (ownerId, value) {
    const data = { enabled: value };
    yield this.api.patch(`/v2_subscription/${this.id}/auto_refill`, { data });

    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),
  autoRefillAddonId: reads('auto_refill.addon_id'),
  autoRefillEnabled: reads('auto_refill.enabled'),
  autoRefillThreshold: reads('auto_refill.threshold'),
  autoRefillAmount: reads('auto_refill.amount'),
  autoRefillThresholds: reads('plan.autoRefillThresholds'),
  autoRefillAmounts: reads('plan.autoRefillAmounts'),
  autoRefillUpdate: task(function* (threshold, amount) {
    const data = { addon_id: this.autoRefillAddonId, threshold: parseInt(threshold), amount: parseInt(amount) };
    yield this.api.patch(`/v2_subscription/${this.id}/update_auto_refill`, { data });

    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  cancelSubscription: task(function* (data) {
    yield this.api.post(`/v2_subscription/${this.id}/pause`, {
      data
    });
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),
});
