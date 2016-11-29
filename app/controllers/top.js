/* globals HS */
import Ember from 'ember';
import config from 'travis/config/environment';

const { alias } = Ember.computed;
const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  store: service(),
  storage: service(),
  externalLinks: service(),

  user: alias('auth.currentUser'),

  userName: Ember.computed('user.login', 'user.name', function () {
    return this.get('user.name') || this.get('user.login');
  }),

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

  broadcasts: Ember.computed('broadcasts', function () {
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
        Authorization: 'token ' + (this.auth.token())
      };
      seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
      if (seenBroadcasts) {
        seenBroadcasts = JSON.parse(seenBroadcasts);
      } else {
        seenBroadcasts = [];
      }
      Ember.$.ajax(apiEndpoint + '/v3/broadcasts', options).then((response) => {
        const receivedBroadcasts = response.broadcasts.reduce((processed, broadcast) => {
          if (!broadcast.expired && seenBroadcasts.indexOf(broadcast.id.toString()) === -1) {
            processed.unshift(Ember.Object.create(broadcast));
          }

          return processed;
        }, []);
        Ember.run(() => {
          broadcasts.set('lastBroadcastStatus', this.defineTowerColor(receivedBroadcasts));
          broadcasts.set('content', receivedBroadcasts);
          broadcasts.set('isLoading', false);
        });
      });
      return broadcasts;
    }
  }),

  deploymentVersion: Ember.computed(function () {
    if (window && window.location) {
      const hostname = window.location.hostname;

      if (hostname.indexOf('ember-beta') === 0 || hostname.indexOf('ember-canary') === 0) {
        return `Ember ${Ember.VERSION}`;
      } else if (hostname.indexOf('test-deployments') > 0) {
        const branchName = hostname.split('.')[0];
        const branchURL = this.get('externalLinks').travisWebBranch(branchName);
        const branchLink = `<a href='${branchURL}'><code>${branchName}</code></a>`;

        return Ember.String.htmlSafe(`Test deployment ${branchLink}`);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }),

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
      let status = this.defineTowerColor(this.get('broadcasts.content'));
      this.set('broadcasts.lastBroadcastStatus', status);
      return false;
    },

    helpscoutTrigger() {
      HS.beacon.open();
      return false;
    }
  },

  showCta: Ember.computed('auth.signedIn', 'landingPage', 'features.proVersion', function () {
    return !this.get('auth.signedIn') &&
      !this.get('features.proVersion') &&
      !this.get('landingPage');
  }),

  classProfile: Ember.computed('tab', 'auth.state', function () {
    var classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(this.get('auth.state') || 'signed-out');

    return classes.join(' ');
  })
});
