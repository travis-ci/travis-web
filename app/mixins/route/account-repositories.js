import Mixin from '@ember/object/mixin';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

const { profileReposPerPage } = config.pagination;

export default Mixin.create({
  features: service(),

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
      // TODO: Make perPage property configurable
      const deprecatedOffset = (params.page - 1) * profileReposPerPage;
      const githubActiveOnOrgOffset = (params['apps-org-page'] - 1) * profileReposPerPage;
      const githubInactiveOnOrgOffset = (params['apps-page'] - 1) * profileReposPerPage;

      let queryParams = {
        sort_by: 'name',
        limit: profileReposPerPage,
        custom: {
          owner: account.login,
          type: 'byOwner',
        },
      };

      let deprecatedParams =
        Object.assign({
          'repository.managed_by_installation': false,
          offset: deprecatedOffset
        }, queryParams);

      let githubActiveOnOrgParams =
        Object.assign({
          'repository.managed_by_installation': true,
          'repository.active_on_org': true,
          offset: githubActiveOnOrgOffset
        }, queryParams);

      let githubInactiveOnOrgParams =
        Object.assign({
          'repository.managed_by_installation': true,
          'repository.active_on_org': false,
          offset: githubInactiveOnOrgOffset
        }, queryParams);

      if (this.get('features.github-apps')) {
        deprecatedParams['repository.active'] = true;
      }

      let hashObject = {
        deprecated: this.store.paginated(
          'repo',
          deprecatedParams,
          { live: false }
        )
      };

      if (this.get('features.github-apps')) {
        hashObject.lockedGithubAppsRepositories = this.store.paginated(
          'repo',
          githubActiveOnOrgParams,
          { live: false }
        );

        hashObject.notLockedGithubAppsRepositories = this.store.paginated(
          'repo',
          githubInactiveOnOrgParams,
          { live: false }
        );
      }

      return hash(hashObject);
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
