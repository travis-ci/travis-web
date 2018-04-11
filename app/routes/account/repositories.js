import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { hash } from 'rsvp';
import { merge } from '@ember/polyfills';

export default TravisRoute.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  @computed()
  recordsPerPage() {
    return config.pagination.profileReposPerPage;
  },

  model(params) {
    const account = this.modelFor('account');
    // account is an Ember Data user or organization
    if (!account.error) {
      // TODO: Make perPage property configurable
      const offset = (params.page - 1) * this.get('recordsPerPage');
      let queryParams = {
        offset,
        sort_by: 'name',
        limit: this.get('recordsPerPage'),
        custom: {
          owner: account.get('login'),
          type: 'byOwner',
        },
      };

      // FIXME this p uggers, what is to be done?
      let deprecatedParams =
        merge(Object.create(queryParams), {'repository.managed_by_installation': false});
      let githubParams =
        merge(Object.create(queryParams), {'repository.managed_by_installation': true});

      let hashObject = {
        deprecated: this.store.paginated(
          'repo',
          deprecatedParams,
          { live: false }
        )
      };

      if (config.githubApps) {
        hashObject.githubApps = this.store.paginated(
          'repo',
          githubParams,
          { live: false }
        );
      }

      return hash(hashObject);
    }
  },

  setupController(controller, model) {
    const account = this.modelFor('account');
    if (!account.error) {
      controller.set('login', account.get('login'));
    }
    controller.set('account', account);
    return this._super(...arguments);
  },
});
