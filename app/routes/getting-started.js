import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

export default TravisRoute.extend({
  beforeModel(/*transition*/) {
    if (!Ember.isEmpty(this.store.peekAll('repo'))) {
      this.transitionTo('/');
    }
  },

  setupController(/*controller*/) {
    // TODO: Simply use controllerFor here.
    return Ember.getOwner(this).lookup('controller:repos').activate('owned');
  }
});
