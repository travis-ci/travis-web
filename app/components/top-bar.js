/* global HS */
import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tagName: 'header',
  classNames: ['top'],
  auth: service(),
  store: service(),
  externalLinks: service(),
  features: service(),
  broadcastsService: service('broadcasts'),

  landingPage: false,

  @alias('auth.currentUser') user: null,

  @computed('user.{login,name}')
  userName(login, name) {
    return name || login;
  },

  @alias('broadcastsService.broadcasts') broadcasts: null,

  @computed()
  deploymentVersion() {
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
  },

  actions: {
    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },

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

  @computed('auth.signedIn', 'landingPage', 'features.proVersion')
  showCta(signedIn, landingPage, pro) {
    return !signedIn && !landingPage && !pro;
  },

  @computed('tab', 'auth.state')
  classProfile(tab, authState) {
    let classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(authState || 'signed-out');

    return classes.join(' ');
  }
});
