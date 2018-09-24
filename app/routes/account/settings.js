import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  @service featureFlags: null,

  model() {
    const featureFlags = this.featureFlags.fetchTask.perform({ forceServerRequest: true });
    const account = this.modelFor('account');
    return hash({ featureFlags, account });
  }
});
