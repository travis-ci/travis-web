import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    gaCta(location) {
      _gaq.push(['_trackPageview', '/virtual/signup?' + location]);
      return this.auth.signIn();
    }
  }
});
