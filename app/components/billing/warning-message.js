import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  sameAddons: computed('subscription.addons.[]', 'selectedPlan.addon_configs.[]', function () {
    if (!this.selectedPlan.addon_configs || !this.subscription.addons)
      return false;
    let sameAddon = false;
    this.selectedPlan.addon_configs.forEach(addonConfig => {
      this.subscription.addons.forEach(addon => {
        if (addon.name === addonConfig.name && addon.type === addonConfig.type)
          sameAddon = true;
      });
    });
    return sameAddon;
  })
});
