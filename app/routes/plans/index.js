import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import pushPayload from 'travis/serializers/plan'

export default TravisRoute.extend({
  auth: service(),
  router: service(),
  store: service(),

  beforeModel() {
    if (this.auth.signedIn) {
      this.router.transitionTo('account.billing');
    }
  },

  model() {
    pushPayload(this.store, { '@type': 'plans', plans: config.plans });

    return {
      plans: this.store.peekAll('plan'),
    };
  },
});
