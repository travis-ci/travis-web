import Mixin from '@ember/object/mixin';
import { hash } from 'rsvp';

export default Mixin.create({
  account: null,

  queryParams: {
    page: {
      refreshModel: true
    },
    'apps-page': {
      refreshModel: true
    },
    'apps-org-page': {
      refreshModel: true
    }
  },

  beforeModel({ targetName }) {
    const isOrganization = targetName.indexOf('organization') > -1;
    const accountRouteName = isOrganization ? 'organization' : 'account';
    this.account = this.modelFor(accountRouteName);
  },

  model(params) {
    const account = this.account;
    if (!account.error) {
      return hash({
        deprecated: account.webhooksRepositories.switchToPage(
          params['page']
        ),
        lockedGithubAppsRepositories: account.githubAppsRepositoriesOnOrg.switchToPage(
          params['apps-org-page']
        ),
        notLockedGithubAppsRepositories: account.githubAppsRepositories.switchToPage(
          params['apps-page']
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
