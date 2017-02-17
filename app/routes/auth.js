import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

const { service } = Ember.inject;

export default Ember.Route.extend(BaseRouteMixin, {
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
      this.transitionTo('main');
      return true;
    }
  },

  redirect() {
    if (this.signedIn()) {
      return this.transitionTo('main');
    }
  }
});
