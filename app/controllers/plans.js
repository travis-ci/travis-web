/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service auth: null,

  @action
  gaCta(location) {
    if (config.gaCode) {
      const page = `/virtual/signup?${location}`;
      _gaq.push(['_trackPageview', page]);
    }
    this.get('auth').signIn();
  },
});
