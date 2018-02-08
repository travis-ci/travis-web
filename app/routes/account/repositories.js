import TravisRoute from 'travis/routes/basic';
// eslint-disable-next-line
import config from 'travis/config/environment';
import { alias } from 'ember-decorators/object/computed';

export default TravisRoute.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  @alias('config.pagination.profileReposPerPage') recordsPerPage: null,

  model(params) {
    const accountModel = this.modelFor('account');
    // account is an Ember-Data model
    if (!accountModel.error) {
      // TODO: Make perPage property configurable
      const account = accountModel.account;
      const offset = (params.page - 1) * this.get('recordsPerPage');
      return this.store.paginated(
        'repo',
        {
          offset,
          sort_by: 'name',
          limit: this.get('recordsPerPage'),
          custom: {
            owner: account.get('login'),
            type: 'byOwner',
          },
        },
        { live: false }
      );
    }
  },

  setupController(controller, model) {
    const accountModel = this.modelFor('account');
    if (!accountModel.error) {
      const account = accountModel.account;
      controller.set('login', account.get('login'));
    }
    return this._super(...arguments);
  },
});
