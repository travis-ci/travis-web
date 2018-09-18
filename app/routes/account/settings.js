import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service featureFlags: null,

  beforeModel() {
    let account = this.modelFor('account').account;

    if (account.type === 'organization') {
      this.transitionTo('account');
    }
  },

  model() {
    return this.featureFlags.fetchTask.perform({ forceServerRequest: true });
  },

  setupController(controller, model) {
    const featureFlags = model;
    const account = this.modelFor('account');
    controller.setProperties({ featureFlags, account });
    controller.fetchRepositories.perform();
  }
});
