import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { equal, or, gte } from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  startingPrice: attr('number'),
  startingUsers: attr('number'),
  privateCredits: attr('number'),
  publicCredits: attr('number'),
  concurrencyLimit: attr('number'),
  planType: attr('string'),
  availableStandaloneAddons: attr(),
  annual: attr('boolean'),
  autoRefillThresholds: attr(),
  autoRefillAmounts: attr(),
  trialPlan: attr(),
  trialConfig: attr(),
  travisPricingUrl: 'https://docs.travis-ci.com/user/billing-overview/#usage-based-plans',


  isFree: equal('startingPrice', 0),
  isTrial: equal('trialPlan', true),
  isProTier: equal('id', 'standard_tier_plan'),
  isStandardTier: equal('id', 'pro_tier_plan'),

  isUnlimitedUsers: gte('startingUsers', 999999),

  isAnnual: equal('annual', true),

  privateCreditsTotal: computed('privateCredits', 'isAnnual', function () {
    return this.isAnnual ? this.privateCredits * 12 : this.privateCredits;
  }),

  hasTrialPeriod: computed('trialConfig', function () {
    return  this.trialConfig != null;
  }),

  addonConfigs: attr(),
  hasCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return (this.addonConfigs || []).filter(addon => addon.type === 'credit_private').length > 0;
  }),
  hasOSSCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return (this.addonConfigs || []).filter(addon => addon.type === 'credit_public').length > 0;
  }),
  hasUserLicenseAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return (this.addonConfigs || []).filter(addon => addon.type === 'user_license').length > 0;
  }),
  hasCredits: or('hasCreditAddons', 'hasOSSCreditAddons'),

  isNotStandardOrProTier: computed('isProTier', 'isStandardTier', function () {
    return !(this.isProTier || this.isStandardTier);
  }),

  planMinutes: computed('privateCreditsTotal', 'publicCredits', 'isAnnual', 'userLicenseAddons', 'hasPaidUserLicenseAddons', function () {
    let userLicenseCreditsAmount = 0;
    if (this.hasPaidUserLicenseAddons) {
      userLicenseCreditsAmount = (this.userLicenseAddons || []).filter(addon => !addon.free)[0].price || 0;
    }
    let minutes = 0;
    if (this.isAnnual) {
      minutes = Math.floor((this.privateCreditsTotal + this.publicCredits - (userLicenseCreditsAmount * 12)) / 10);
    } else {
      minutes = Math.floor((this.privateCreditsTotal + this.publicCredits - userLicenseCreditsAmount) / 10);
    }
    return Intl.NumberFormat('en', { notation: 'compact' }).format(minutes).toLowerCase();
  }),

  userLicenseAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return (this.addonConfigs || []).filter(addon => addon.type === 'user_license');
  }),

  usersInPlan: computed('addonConfigs', function () {
    let freeAddon = this.hasUserLicenseAddons && (this.userLicenseAddons || []).filter(addon => addon.free);

    if (freeAddon.length > 0) freeAddon = freeAddon[0];
    return freeAddon?.quantity || 0;
  }),

  discountedUsersInPlan: computed('addonConfigs', function () {
    let paidAddon = this.hasUserLicenseAddons && (this.userLicenseAddons || []).filter(addon => !addon.free);
    if (paidAddon.length > 0) paidAddon = paidAddon[0];
    return paidAddon?.pre_purchase_user_count || 0;
  }),

  creditsPerUserInPlan: computed('addonConfigs', function () {
    let paidAddon = this.hasUserLicenseAddons && (this.userLicenseAddons || []).filter(addon => !addon.free);
    if (paidAddon.length > 0) paidAddon = paidAddon[0];
    return paidAddon?.price || 0;
  }),


  hasPaidUserLicenseAddons: computed('addonConfigs', 'userLicenseAddons', 'hasUserLicenseAddons', 'addonConfigs.@each.free', function () {
    return this.hasUserLicenseAddons && (this.userLicenseAddons || []).filter(addon => !addon.free).length > 0;
  }),
});
