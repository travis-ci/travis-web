import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  featureFlags: service(),

  model() {
    const featureFlags = this.featureFlags.fetchTask.perform({ forceServerRequest: true });
    const account = this.modelFor('account');
    return hash({ featureFlags, account });
  }
});
