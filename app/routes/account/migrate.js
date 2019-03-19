import Route from '@ember/routing/route';

export default Route.extend({

  page: 1,

  model({ page }) {
    this.setProperties({ page });
    return this.modelFor('account');
  },

  afterModel(model) {
    if (model && !model.error) {
      model.githubAppsRepositoriesOnOrg.switchToPage(this.page);
    }
  }

});
