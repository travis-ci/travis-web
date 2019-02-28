import Mixin from '@ember/object/mixin';
import { hash } from 'rsvp';

export default Mixin.create({
  account: null,

  queryParams: {
    'appsPage': {
      refreshModel: true
    },
    'legacyPage': {
      refreshModel: true
    }
  },

  model(params) {
    const account = this.account;
    if (!account.error) {
      return hash({
        deprecated: account.legacyRepositories.switchToPage(
          params['legacyPage']
        ),
        notLockedGithubAppsRepositories: account.githubAppsRepositories.switchToPage(
          params['appsPage']
        )
      });
    }
  },

  setupController(controller, model) {
    const account = this.account;
    if (!account.error) {
      const { login } = account;
      controller.setProperties({ account, login });
    }
    return this._super(...arguments);
  }
});
