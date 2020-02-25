import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  auth: service(),
  router: service(),

  beforeModel() {
    if (this.auth.signedIn) {
      this.router.transitionTo('account.billing')
    }
  },
});
