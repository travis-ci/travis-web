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
  trialPlan: attr(),

  isFree: equal('startingPrice', 0),
  isTrial: equal('trialPlan', true),

  isUnlimitedUsers: equal('startingUsers', 999999),

  addonConfigs: attr(),
  hasCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addonConfigs.filter(addon => addon.type === 'credit_private').length > 0;
  }),
  hasOSSCreditAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addonConfigs.filter(addon => addon.type === 'credit_public').length > 0;
  }),
  hasUserLicenseAddons: computed('addonConfigs', 'addonConfigs.@each.type', function () {
    return this.addonConfigs.filter(addon => addon.type === 'user_license').length > 0;
  }),
  hasCredits: or('hasCreditAddons', 'hasOSSCreditAddons')
});
