import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Route.extend({
  auth: service(),
  router: service(),
  needsAuth: false,

  isRedirectingToAccountPage: computed('model.redirectUri', function () {
    return this.router.urlFor('account.billing') === this.model.redirectUri;
  }),

  beforeModel() {
    if (this.get('auth.signedIn')) {
      this.transitionTo('index');
    } else {
      this.auth.signIn();
    }
  }
});
