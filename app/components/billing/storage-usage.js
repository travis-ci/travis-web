import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  storageAddon: reads('subscription.storageAddon'),
  storageAddonUsage: reads('subscription.storageAddon.current_usage'),

});
