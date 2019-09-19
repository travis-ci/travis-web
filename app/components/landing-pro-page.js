/* global _gaq */
import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  auth: service(),
  features: service(),

  enableAssemblaLogin: computed(function () {
    return this.features.get('enable-assembla-login');
  }),

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
