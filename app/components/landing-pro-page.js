/* global _gaq */
import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  actions: {
    gaCta(location) {
      if (config.gaCode) {
        _gaq.push(['_trackPageview', `/virtual/signup?${location}`]);
      }
      this.auth.signIn();
    },

    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },
  },
});
