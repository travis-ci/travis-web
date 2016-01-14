import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Controller.extend({
  actions: {
    gaCta(location) {
      if(config.gaCode) {
        _gaq.push(['_trackPageview', '/virtual/signup?' + location]);
      }
      this.auth.signIn();
    }
  }
});
