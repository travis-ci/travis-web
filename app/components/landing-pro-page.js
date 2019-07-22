/* global _gaq */
import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),

  actions: {
    gaCta(location) {
      if (config.gaCode) {
        _gaq.push(['_trackPageview', `/virtual/signup?${location}`]);
      }
      this.auth.signIn();
    },

    signIn() {
      return this.signIn();
    },

    signOut() {
      return this.signOut();
    },
  },
});
