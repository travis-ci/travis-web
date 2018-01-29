import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  recordsPerPage: 25,

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model(params) {
    const account = this.modelFor('account');
    // account is an Ember-Data model
    if (!account.error) {
      // TODO: Make perPage property configurable
      const offset = (params.page - 1) * this.get('recordsPerPage');
      return this.store.paginated(
        'repo',
        {
          offset,
          sort_by: 'name',
          limit: 25,
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
    const account = this.modelFor('account');
    if (!account.error) {
      controller.set('login', account.get('login'));
    }
    return this._super(...arguments);
  },
});
