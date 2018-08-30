import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  @service featureFlags: null,

  beforeModel() {
    let account = this.modelFor('account').account;

    if (account.type === 'organization') {
      this.transitionTo('account');
    }
  },

  model() {
    return hash({
      featureFlags: this.featureFlags.fetchTask.perform({ forceServerRequest: true }),
      repositories: this.store.findAll('repo')
    });
  },

  setupController(controller, model) {
    const { featureFlags, repositories = [] } = model;
    const account = this.modelFor('account');
    controller.setProperties({ featureFlags, account, repositories });
  }
});
