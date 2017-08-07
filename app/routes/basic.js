import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Route.extend({
  @service auth: null,
  @service featureFlags: null,

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
    } else if (this.redirectToProfile(transition)) {
      return this.transitionTo('profile', this.get('auth.currentUser.login'));
    } else {
      return this._super(...arguments);
    }
  },

  signedIn() {
    return this.get('auth.currentUser');
  },

  redirectToProfile(transition) {
    // make this hack the least invasive it can be
    let { targetName } = transition;
    let { params } = transition;
    if (targetName === 'owner.repositories' &&
       params.owner &&
       params.owner.owner &&
       params.owner.owner === 'profile') {
      this.transitionTo('account', this.get('auth.currentUser.login'));
    }
  },

  // on pro, we need to auth on every route
  @alias('features.proVersion') needsAuth: null,
});
