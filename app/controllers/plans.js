/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { action } from 'ember-decorators/object';

export default Controller.extend({
  @action
  gaCta(location) {
    if (config.gaCode) {
      const page = `/virtual/signup?${location}`;
      _gaq.push(['_trackPageview', page]);
    }
    this.auth.signIn();
  },
});
