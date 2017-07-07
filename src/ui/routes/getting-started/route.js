import TravisRoute from "travis/src/ui/routes/basic";
import Ember from 'ember';

export default TravisRoute.extend({
  beforeModel() {
    if (!Ember.isEmpty(this.store.peekAll('repo'))) {
      this.transitionTo('/');
    }
  },

  setupController() {
    this._super(...arguments);
    this.controllerFor('repos').activate('owned');
  }
});
