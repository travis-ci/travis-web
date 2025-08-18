import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({

  subscription: null,
  account: null,

  storageAddon: reads('subscription.storageAddon'),
  storageAddonUsage: reads('subscription.storageAddon.current_usage'),

  storageAddonUsageTotalUsage: computed('storageAddonUsage', function () {
    return this.storageAddonUsage.addon_usage || 0;
  }),
  storageAddonUsageTotalUsagePercentage: computed('storageAddonUsage', function () {
    const used = this.storageAddonUsage.addon_usage;
    const percentage = 100 - used / this.storageAddonUsage.addon_quantity * 100;
    return percentage > 0 ? percentage : 0;
  }),
});
