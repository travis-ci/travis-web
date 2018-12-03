import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default BasicRoute.extend({
  needsAuth: false,

  features: service(),

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
