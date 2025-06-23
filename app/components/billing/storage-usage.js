import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({

  subscription: null,
  account: null,

  storageAddon: reads('subscription.storageAddon'),
  storageAddonUsage: reads('subscription.storageAddon.current_usage'),

  storageAddonUsageTotalUsage: computed('storageAddonUsage', function () {
      return Math.round(this.storageAddonUsage.total_usage/1024*100)/100 || 0;
    }),
});
