import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),

  renderTemplate(...args) {
    this._super(args);
    return this.render('repos', {
      outlet: 'left',
      into: 'getting_started'
    });
  },

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
