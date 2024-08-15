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

  hasPaidUserLicenseAddons: computed('addonConfigs', 'userLicenseAddons', 'hasUserLicenseAddons', 'addonConfigs.@each.free', function () {
    return this.hasUserLicenseAddons && (this.userLicenseAddons || []).filter(addon => !addon.free).length > 0;
  }),
});
