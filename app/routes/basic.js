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
    let existingFeatures = this.get('store').peekAll('feature');
    console.log('existingFeatures?', Ember.isEmpty(existingFeatures));
    if (Ember.isEmpty(existingFeatures)) {
      return this.store.findAll('feature').then((payload) => {
        this.setFeatureFlags(payload);
        console.log('post request:', Ember.isEmpty(existingFeatures));
      });
    }
    // } else {
    //   return Ember.RSVP.Promise.resolve(existingFeatures).then((payload) => {
    //     this.setFeatureFlags(payload);
    //   });
    // }
  },

  setFeatureFlags(featureSet) {
    console.log('features #', featureSet.length);
    let features = featureSet.map((feature) => {
      return {
        feature: feature.get('dasherizedName'),
        enabled: feature.get('enabled')
      };
    });
    this.get('features').setup(features);
  }
});
