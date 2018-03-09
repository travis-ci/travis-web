/* global _gaq */
import Component from '@ember/component';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service auth: null,

  actions: {
    gaCta(location) {
      if (config.gaCode) {
        _gaq.push(['_trackPageview', `/virtual/signup?${location}`]);
      }
      this.get('auth').signIn();
    },

    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },
  },
});
