import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import $ from 'jquery';
import ArrayProxy from '@ember/array/proxy';
import Service from '@ember/service';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service auth: null,
  @service storage: null,

  @computed('auth.signedIn')
  broadcasts(signedIn) {
    let apiEndpoint, broadcasts, options, seenBroadcasts;
    if (signedIn) {
      broadcasts = ArrayProxy.create({
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
      $.ajax(`${apiEndpoint}/broadcasts`, options).then((response) => {
        const receivedBroadcasts = response.broadcasts.reduce((processed, broadcast) => {
          if (!broadcast.expired && seenBroadcasts.indexOf(broadcast.id.toString()) === -1) {
            processed.unshift(EmberObject.create(broadcast));
          }

          return processed;
        }, []);
        run(() => {
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
