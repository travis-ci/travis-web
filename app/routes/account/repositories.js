import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';

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
    const accountCompound = this.modelFor('account');
    // account is an Ember Data user or organization
    if (!accountCompound.error) {
      // TODO: Make perPage property configurable
      const offset = (params.page - 1) * this.get('recordsPerPage');
      return this.store.paginated(
        'repo',
        {
          offset,
          sort_by: 'name',
          limit: this.get('recordsPerPage'),
          custom: {
            owner: accountCompound.account.get('login'),
            type: 'byOwner',
          },
        },
        { live: false }
      );
    }
  },

  setupController(controller, model) {
    const accountCompound = this.modelFor('account');
    if (!accountCompound.error) {
      controller.set('login', accountCompound.account.get('login'));
    }
    return this._super(...arguments);
  },
});
