import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  features: service(),
  auth: service(),
  needsAuth: false,
  setupController(model, controller) {
    if (!this.get('auth.signedIn')) {
      if (this.features.isEnabled('enterprise')) {
      } else {
        if (this.features.isEnabled('pro')) {
          this.controller.set('landingContent', 'landing-pages/pro');
        } else {
          this.controller.set('landingContent', 'landing-pages/org');
        }
      }
    }
  }
});
