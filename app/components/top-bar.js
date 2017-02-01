/* global HS */
import Ember from 'ember';

const { alias } = Ember.computed;
const { service } = Ember.inject;

export default Ember.Component.extend({
  auth: service(),
  store: service(),
  externalLinks: service(),
  features: service(),
  broadcastsService: service('broadcasts'),

  user: alias('auth.currentUser'),

  userName: Ember.computed('user.login', 'user.name', function () {
    return this.get('user.name') || this.get('user.login');
  }),

  broadcasts: Ember.computed.alias('broadcastsService.broadcasts'),

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
      this.get('broadcastsService').markAsSeen(broadcast);
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
    let classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(this.get('auth.state') || 'signed-out');

    return classes.join(' ');
  })
});
