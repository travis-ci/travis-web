import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  sameAddons: computed('subscription.addons.[]', 'selectedPlan.addon_configs.[]', function () {
    if (!this.selectedPlan.addon_configs || !this.subscription.addons)
      return false;
    return this.selectedPlan.addon_configs.any(addonConfig => (
      this.subscription.addons.any(addon => (
        addon.name === addonConfig.name && addon.type === addonConfig.type
      ))
    ));
  })
});
