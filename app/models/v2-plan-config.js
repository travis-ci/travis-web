import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { equal, or } from '@ember/object/computed';

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

  isFree: equal('startingPrice', 0),
  isTrial: equal('trialPlan', true),
  isProTier: equal('id', 'standard_tier_plan'),
  isStandardTier: equal('id', 'pro_tier_plan'),

  isUnlimitedUsers: equal('startingUsers', 999999),

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
});
