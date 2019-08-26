import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  features: service(),
  broadcastsService: service('broadcasts'),

  broadcasts: alias('broadcastsService.broadcasts'),

  actions: {
    toggleBroadcasts() {
      this.toggleProperty('showBroadcasts');
      return false;
    },

    markBroadcastAsSeen(broadcast) {
      this.broadcastsService.markAsSeen(broadcast);
      return false;
    },
  }
});
