/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  config,

  auth: service(),

  actions: {
    gaCta(location) {
      if (config.gaCode) {
        const page = `/virtual/signup?${location}`;
        _gaq.push(['_trackPageview', page]);
      }
      this.auth.signIn();
    }
  }
});
