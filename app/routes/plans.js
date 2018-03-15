import BasicRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default BasicRoute.extend({
  needsAuth: false,

  @service features: null,

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
