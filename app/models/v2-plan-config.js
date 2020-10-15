import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  startingPrice: attr('number'),
  startingUsers: attr('number'),
  privateCredits: attr('number'),
  publicCredits: attr('number'),
  price: attr('number'),
  type: attr('string'),
  availableStandaloneAddons: attr(),

  isFree: equal('startingPrice', 0),

  isUnlimitedUsers: equal('startingUsers', 999999),

  addonConfigs: attr(),
  hasCreditAddons: computed('addonConfigs', function () {
    return this.addonConfigs.filter(addon => addon.type === 'credit_private').length > 0;
  }),
  hasOSSCreditAddons: computed('addonConfigs', function () {
    return this.addonConfigs.filter(addon => addon.type === 'credit_public').length > 0;
  })
});
