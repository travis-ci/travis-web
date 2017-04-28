import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),

  needsAuth: false,

  renderTemplate() {
    Ember.$('body').attr('id', 'auth');
    return this.render('signin');
  },

  deactivate() {
    return this.get('auth').set('redirected', false);
  },

  actions: {
    afterSignIn() {
      if (this.get('features.dashboard')) {
        this.transitionTo('dashboard');
      } else {
        this.transitionTo('main');
      }
      return true;
    }
  },

  redirect() {
    if (this.signedIn()) {
      if (this.get('features.dashboard')) {
        return this.transitionTo('dashboard');
      } else {
        return this.transitionTo('main');
      }
    }
  }
});
