import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
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
