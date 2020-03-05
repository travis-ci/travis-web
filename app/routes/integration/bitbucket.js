import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  router: service(),

  redirect() {
    if (this.auth.isSignedInWith('bitbucket')) {
      this.router.transitionTo('account.repositories');
    }
  }
});
