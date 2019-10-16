import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  router: service('router'),
  needsAuth: false,

  beforeModel() {
    if (this.get('auth.signedIn')) {
      this.transitionTo('index');
    } else {
      this.auth.signIn();
    }
  }
});
