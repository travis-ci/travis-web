import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

export default Route.extend({
  @service auth: null,
  needsAuth: false,

  beforeModel() {
    if (this.get('auth.signedIn')) {
      this.transitionTo('index');
    } else {
      this.get('auth').signIn();
    }
  }
});
