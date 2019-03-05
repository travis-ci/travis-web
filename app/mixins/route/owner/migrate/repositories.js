import Mixin from '@ember/object/mixin';

export default Mixin.create({
  owner: null,
  repositories: null,
  page: 1,

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    this.page = page;
  },

  afterModel() {
    const { page, repositories } = this;
    repositories.switchToPage(page);
  },

  setupController(controller) {
    const { owner, page, repositories } = this;
    controller.setProperties({ owner, page, repositories });
  }
});
