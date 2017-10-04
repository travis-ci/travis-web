import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    offset: {
      refreshModel: true
    }
  },

  model(params) {
    const account = this.modelFor('account');
    // account is an Ember-Data model
    if (!account.error) {
      return this.store.paginated(
        'repo',
        {
          offset: params.offset,
          sort_by: 'name',
          limit: 25,
          custom: {
            owner: account.get('login'),
            type: 'byOwner',
          },
        },
        {}
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
