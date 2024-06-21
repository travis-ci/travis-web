import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  sameAddons: computed('subscription.addons.[]', 'selectedPlan.addonConfigs.[]', function () {
    if (!this.selectedPlan.addonConfigs || !this.subscription.addons)
      return false;
    return this.selectedPlan.addonConfigs.some(addonConfig => (
      this.subscription.addons.some(addon => (
        addon.name === addonConfig.name && addon.type === addonConfig.type
      ))
    ));
  })
});
