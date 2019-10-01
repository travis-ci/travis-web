/* global _gaq */
import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  multiVcs: service(),

  actions: {
    gaCta(location, provider) {
      if (config.gaCode) {
        _gaq.push(['_trackPageview', `/virtual/signup?${location}`]);
      }
      this.auth.signInWith(provider);
    },

    signOut() {
      return this.signOut();
    },
  },
});
