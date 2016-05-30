import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

export default TravisRoute.extend({
  beforeModel(transition) {
    if (!Ember.isEmpty(this.store.peekAll('repo'))) {
      this.transitionTo('/');
    }
  },

  setupController(controller) {
    return Ember.getOwner(this).lookup('controller:repos').activate('owned');
  }
});
