import Route from '@ember/routing/route';

export default Route.extend({

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    const owner = this.modelFor('account');
    return owner.webhooksRepositories.reload({ page });
  },

  setupController(controller, model) {
    this._super(...arguments);
    const owner = this.modelFor('account');
    controller.setProperties({ owner });
  }

});
