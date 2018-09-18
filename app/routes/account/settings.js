import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';
import fetchAll from 'travis/utils/fetch-all';

export default TravisRoute.extend({
  @service featureFlags: null,

  beforeModel() {
    let account = this.modelFor('account').account;

    if (account.type === 'organization') {
      this.transitionTo('account');
    }
  },

  model() {
    return fetchAll(this.store, 'repo', {}).then(() => hash({
      featureFlags: this.featureFlags.fetchTask.perform({ forceServerRequest: true }),
      repositories: this.store.peekAll('repo')
    }));
  },

  setupController(controller, model) {
    const { featureFlags, repositories = [] } = model;
    const account = this.modelFor('account');
    controller.setProperties({ featureFlags, account, repositories });
  }
});
