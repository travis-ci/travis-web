import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default Mixin.create({
  features: service(),
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
        const queryParams = { page };
        this.transitionTo({ queryParams });
      });
      if (repos.isAny('isMigrationSucceeded')) {
        repos.reload();
      }
      return repos.load();
    }
  },

  redirect(model, transition) {
    if (!this.get('features.proVersion') || this.get('features.enterpriseVersion')) {
      transition.abort();
      model.isUser ? this.transitionTo('account.repositories') : this.transitionTo('organization.repositories', model);
    }
  }

});
