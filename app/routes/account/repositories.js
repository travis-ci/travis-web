import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  @service features: null,

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

  @computed()
  recordsPerPage() {
    return config.pagination.profileReposPerPage;
  },

  model(params) {
    const accountCompound = this.modelFor('account');
    // account is an Ember Data user or organization
    if (!accountCompound.error) {
      // TODO: Make perPage property configurable
      const deprecatedOffset = (params.page - 1) * this.get('recordsPerPage');
      const githubActiveOnOrgOffset = (params['apps-org-page'] - 1) * this.get('recordsPerPage');
      const githubInactiveOnOrgOffset = (params['apps-page'] - 1) * this.get('recordsPerPage');

      let queryParams = {
        sort_by: 'name',
        limit: this.get('recordsPerPage'),
        custom: {
          owner: accountCompound.account.get('login'),
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
    const accountCompound = this.modelFor('account');
    if (!accountCompound.error) {
      controller.set('login', accountCompound.account.get('login'));
      controller.set('account', accountCompound.account);
    }
    return this._super(...arguments);
  },
});
