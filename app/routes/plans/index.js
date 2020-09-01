import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  auth: service(),
  router: service(),

  beforeModel() {
    if (this.auth.signedIn) {
      this.router.transitionTo('account.billing');
    }
  },

  model() {
    this.store.pushPayload('plan', { '@type': 'plans', plans: config.plans });

    return {
      plans: this.store.peekAll('plan'),
    };
  },
});
