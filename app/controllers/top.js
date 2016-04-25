import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  userBinding: 'auth.currentUser',
  store: service(),
  storage: service(),
  currentUserBinding: 'auth.currentUser',

  userName: function() {
    return this.get('user.name') || this.get('user.login');
  }.property('user.login', 'user.name'),

  defineTowerColor(broadcastArray) {
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
  },

  broadcasts: function() {
    var apiEndpoint, broadcasts, options, seenBroadcasts;
    if (this.get('auth.signedIn')) {
      broadcasts = Ember.ArrayProxy.create({
        content: [],
        lastBroadcastStatus: '',
        isLoading: true
      });
      apiEndpoint = config.apiEndpoint;
      options = {};
      options.type = 'GET';
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
      seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
      if (seenBroadcasts) {
        seenBroadcasts = JSON.parse(seenBroadcasts);
      } else {
        seenBroadcasts = [];
      }
      $.ajax(apiEndpoint + "/v3/broadcasts", options).then((response) => {
        var receivedBroadcasts;
        if (response.broadcasts.length) {
          receivedBroadcasts = response.broadcasts.filter(function(broadcast) {
            if (!broadcast.expired) {
              if (seenBroadcasts.indexOf(broadcast.id.toString()) === -1) {
                return broadcast;
              }
            }
          }).map(function(broadcast) {
            return Ember.Object.create(broadcast);
          }).reverse();
        }
        broadcasts.set('lastBroadcastStatus', this.defineTowerColor(receivedBroadcasts));
        broadcasts.set('content', receivedBroadcasts);
        return broadcasts.set('isLoading', false);
      });
      return broadcasts;
    }
  }.property('broadcasts'),

  actions: {
    toggleBurgerMenu() {
      this.toggleProperty('is-open');
      return false;
    },

    toggleBroadcasts() {
      this.toggleProperty('showBroadcasts');
      return false;
    },

    markBroadcastAsSeen(broadcast) {
      var id, seenBroadcasts;
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
      this.set('broadcasts.lastBroadcastStatus', this.defineTowerColor(this.get('broadcasts.content')));
      return false;
    }
  },
  showCta: function() {
    return !this.get('auth.signedIn') && !this.get('config.pro') && !this.get('landingPage');
  }.property('auth.signedIn', 'landingPage'),

  classProfile: function() {
    var classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(this.get('controller.auth.state') || 'signed-out');

    return classes.join(' ');
  }.property('tab', 'auth.state')
});
