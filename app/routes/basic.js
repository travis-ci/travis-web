import { reject } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  router: service(),
  featureFlags: service(),
  storage: service(),

  activate() {
    if (this.storage.wizardStep > 0 && this.storage.wizardStep <= 3) {
      if (this.storage.wizardStep == 1) {
        this.router.transitionTo('account_activation');
      } else {
        this.router.transitionTo('account.repositories');
      }
      return this._super(...arguments);
    }

    if (this.routeName !== 'error') {
      this.controllerFor('error').set('layoutName', null);
    }
    return this._super(...arguments);
  },

  beforeModel(transition) {
    if (!this.auth.signedIn && this.needsAuth) {
      return reject('needs-auth');
    } else if (this.redirectToProfile(transition)) {
      return this.router.transitionTo('account');
    } else {
      return this._super(...arguments);
    }
  },

  redirectToProfile(transition) {
    let { targetName } = transition;
    let { owner } = this.paramsFor('owner');
    if (targetName === 'owner.repositories' &&
      owner === 'profile') {
      this.router.transitionTo('account', {
        queryParams: { offset: 0 }
      });
    }
  }
});
