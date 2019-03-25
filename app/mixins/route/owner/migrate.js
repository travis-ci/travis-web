import Mixin from '@ember/object/mixin';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

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
      const repos = model.githubAppsRepositoriesOnOrg;
      repos.switchToPage(this.page);
      repos.on(PAGE_CHANGED, page => {
        const queryParams = { 'apps-page': page };
        this.transitionTo({ queryParams });
      });
      if (repos.isAny('isMigrationSucceeded')) {
        repos.reload();
      }
      return repos.load();
    }
  }

});
