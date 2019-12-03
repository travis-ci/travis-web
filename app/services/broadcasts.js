import { run } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  api: service(),
  auth: service(),
  raven: service(),
  storage: service(),

  broadcasts: computed('auth.signedIn', function () {
    let signedIn = this.get('auth.signedIn');
    let broadcasts,  seenBroadcasts;
    if (signedIn) {
      broadcasts = ArrayProxy.create({
        content: [],
        lastBroadcastStatus: '',
        isLoading: true
      });

      seenBroadcasts = this.storage.getItem('travis.seen_broadcasts');
      if (seenBroadcasts) {
        seenBroadcasts = JSON.parse(seenBroadcasts);
      } else {
        seenBroadcasts = [];
      }

      this.api.get('/broadcasts').then((response) => {
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
      }).catch((response) => {
        // 403 Forbidden responses are probably due to token expiry / automatic sign out
        if (response.status !== 403) {
          this.raven.logException(`Broadcast error: (${response.status}) ${response.statusText}`);
        }
      });
      return broadcasts;
    }
  }),

  markAsSeen(broadcast) {
    let id, seenBroadcasts;
    id = broadcast.get('id').toString();
    seenBroadcasts = this.storage.getItem('travis.seen_broadcasts');
    if (seenBroadcasts) {
      seenBroadcasts = JSON.parse(seenBroadcasts);
    } else {
      seenBroadcasts = [];
    }
    seenBroadcasts.push(id);
    this.storage.setItem('travis.seen_broadcasts', JSON.stringify(seenBroadcasts));
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
