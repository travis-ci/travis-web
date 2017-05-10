import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

export default TravisRoute.extend({
  renderTemplate(...args) {
    this._super(args);
    return this.render('repos', {
      outlet: 'left',
      into: 'getting_started'
    });
  },

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
