import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  auth: service(),
  features: service(),

  activate() {
    if (this.routeName !== 'error') {
      this.controllerFor('error').set('layoutName', null);
    }
    return this._super(...arguments);
  },

  beforeModel(transition) {
    if (!this.signedIn()) {
      this.auth.autoSignIn();
      this.fetchAndSetFeatureFlags();
    }
    if (!this.signedIn() && this.get('needsAuth')) {
      this.auth.set('afterSignInTransition', transition);
      return Ember.RSVP.reject('needs-auth');
    } else if (this.redirectToProfile(transition)) {
      return this.transitionTo('profile', this.get('auth.currentUser.login'));
    } else {
      this.fetchAndSetFeatureFlags();
      return this._super(...arguments);
    }
  },

  signedIn() {
    return this.controllerFor('currentUser').get('model');
  },

  // on pro, we need to auth on every route
  needsAuth: Ember.computed.alias('features.proVersion'),

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

  fetchAndSetFeatureFlags() {
    return this.store.findAll('feature').then((payload) => {
      this.setFeatureFlags(payload);
    });
  },

  setFeatureFlags(payload) {
    console.log('payload', content);
    let features = content.map((feature) => {
      return {
        feature: Ember.String.dasherize(feature.get('name')),
        enabled: feature.get('enabled')
      };
    });
    console.log('converted features', features);
    this.get('features').setup(features);
    console.log('features service settings', this.get('features'));
  }
});
