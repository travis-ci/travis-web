import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { hash } from 'rsvp';
import { merge } from '@ember/polyfills';

export default TravisRoute.extend({
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

      // FIXME this p uggers, what is to be done?
      let deprecatedParams =
        merge(Object.create(queryParams), {
          'repository.managed_by_installation': false,
          offset: deprecatedOffset
        });

      let githubActiveOnOrgParams =
        merge(Object.create(queryParams), {
          'repository.managed_by_installation': true,
          'repository.active_on_org': true,
          offset: githubActiveOnOrgOffset
        });
      let githubInactiveOnOrgParams =
        merge(Object.create(queryParams), {
          'repository.managed_by_installation': true,
          'repository.active_on_org': false,
          offset: githubInactiveOnOrgOffset
        });

      let hashObject = {
        deprecated: this.store.paginated(
          'repo',
          deprecatedParams,
          { live: false }
        )
      };

      if (config.githubApps) {
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
