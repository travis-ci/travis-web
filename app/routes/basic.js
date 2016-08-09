import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    if (this.routeName !== 'error') {
      this.controllerFor('error').set('layoutName', null);
    }
    return this._super(...arguments);
  },

  beforeModel(transition) {
    if (!this.signedIn()) {
      this.auth.autoSignIn();
    }
    if (!this.signedIn() && this.get('needsAuth')) {
      this.auth.set('afterSignInTransition', transition);
      return Ember.RSVP.reject('needs-auth');
    } else {
      return this._super(...arguments);
    }
  },

  signedIn() {
    return this.controllerFor('currentUser').get('model');
  },

  // on pro, we need to auth on every route
  needsAuth: Ember.computed.alias('features.proVersion')
});
