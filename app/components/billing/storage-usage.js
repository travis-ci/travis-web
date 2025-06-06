import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { subtractOneDay } from 'travis/utils/subtract-day';

export default Component.extend({

  subscription: null,
  account: null,

  storageAddon: reads('subscription.storageAddon'),
  storageAddonUsage: reads('subscription.storageAddon.current_usage'),

});
