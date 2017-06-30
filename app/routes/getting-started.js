import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),

  beforeModel() {
    if (!Ember.isEmpty(this.store.peekAll('repo')) || !this.get('auth.signedIn')) {
      this.transitionTo('/');
    }
  },

  setupController() {
    this._super(...arguments);
    this.controllerFor('repos').activate('owned');
  }
});
