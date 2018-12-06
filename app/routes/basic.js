import { reject } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  featureFlags: service(),

  activate() {
    if (this.routeName !== 'error') {
      this.controllerFor('error').set('layoutName', null);
    }
    return this._super(...arguments);
  },

  beforeModel(transition) {
    if (!this.signedIn()) {
      this.get('auth').autoSignIn();
    }
    if (!this.signedIn() && this.get('needsAuth')) {
      this.set('auth.afterSignInTransition', transition);
      return reject('needs-auth');
    } else if (this.redirectToProfile(transition)) {
      return this.transitionTo('account');
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
      this.transitionTo('account', {
        queryParams: { offset: 0 }
      });
    }
  }
});
