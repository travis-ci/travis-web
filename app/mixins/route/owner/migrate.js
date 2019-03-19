import Mixin from '@ember/object/mixin';

export default Mixin.create({
  page: 1,

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    this.setProperties({ page });
  },

  afterModel(model) {
    if (model && !model.error) {
      model.githubAppsRepositoriesOnOrg.switchToPage(this.page);
    }
  }

});
