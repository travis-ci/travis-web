import Ember from 'ember';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Ember.Service.extend({
  @service auth: null,
  @service storage: null,

  @computed('auth.signedIn')
  broadcasts(signedIn) {
    let apiEndpoint, broadcasts, options, seenBroadcasts;
    if (signedIn) {
      broadcasts = Ember.ArrayProxy.create({
        content: [],
        lastBroadcastStatus: '',
        isLoading: true
      });

      apiEndpoint = config.apiEndpoint;
      options = {};
      options.type = 'GET';
      options.headers = {
        Authorization: `token ${this.get('auth').token()}`,
        'Travis-API-Version': '3'
      };
      seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
      if (seenBroadcasts) {
        seenBroadcasts = JSON.parse(seenBroadcasts);
      } else {
        seenBroadcasts = [];
      }
      Ember.$.ajax(`${apiEndpoint}/broadcasts`, options).then((response) => {
        const receivedBroadcasts = response.broadcasts.reduce((processed, broadcast) => {
          if (!broadcast.expired && seenBroadcasts.indexOf(broadcast.id.toString()) === -1) {
            processed.unshift(Ember.Object.create(broadcast));
          }

          return processed;
        }, []);
        Ember.run(() => {
          broadcasts.set('lastBroadcastStatus', this.getStatus(receivedBroadcasts));
          broadcasts.set('content', receivedBroadcasts);
          broadcasts.set('isLoading', false);
        });
      });
      return broadcasts;
    }
  },

  markAsSeen(broadcast) {
    let id, seenBroadcasts;
    id = broadcast.get('id').toString();
    seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
    if (seenBroadcasts) {
      seenBroadcasts = JSON.parse(seenBroadcasts);
    } else {
      seenBroadcasts = [];
    }
    seenBroadcasts.push(id);
    this.get('storage').setItem('travis.seen_broadcasts', JSON.stringify(seenBroadcasts));
    this.get('broadcasts.content').removeObject(broadcast);
    let status = this.getStatus(this.get('broadcasts.content'));
    this.set('broadcasts.lastBroadcastStatus', status);
  },

  getStatus(broadcastArray) {
    if (!broadcastArray) {
      return '';
    }
    if (broadcastArray.length) {
      if (broadcastArray.findBy('category', 'warning')) {
        return 'warning';
      } else if (broadcastArray.findBy('category', 'announcement')) {
        return 'announcement';
      } else {
        return '';
      }
    }
  }
});
