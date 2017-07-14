/* global _gaq */
import Ember from 'ember';
import config from 'travis/config/environment';
import { action } from 'ember-decorators/object';

export default Ember.Controller.extend({
  @action
  gaCta(location) {
    if (config.gaCode) {
      _gaq.push(['_trackPageview', '/virtual/signup?' + location]);
    }
    this.auth.signIn();
  },
});
