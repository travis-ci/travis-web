import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default TravisRoute.extend({
  auth: service(),

  currentUser: alias('auth.currentUser'),

  titleToken: 'Beta Features',

  beforeModel() {
    if (!this.get('currentUser')) {
      return this._super(...arguments);
    } else if (!this.get('currentUser.betaProgram')) {
      this.transitionTo('profile');
    }
  },

  model() {
    return this.store.peekAll('feature');
  },

  needsAuth: true
});
