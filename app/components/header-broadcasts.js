import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service auth: null,
  @service('broadcasts') broadcastsService: null,

  @alias('broadcastsService.broadcasts') broadcasts: null,

  @action
  toggleBroadcasts() {
    this.toggleProperty('showBroadcasts');
    return false;
  },

  @action
  markBroadcastAsSeen(broadcast) {
    this.get('broadcastsService').markAsSeen(broadcast);
    return false;
  },
});
