import Route from '@ember/routing/route';

export default Route.extend({

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    const owner = this.modelFor('organization');
    return owner.webhooksRepositories.reload({ page });
  },

  setupController(controller, model) {
    this._super(...arguments);
    const owner = this.modelFor('organization');
    controller.setProperties({ owner });
  }

});
