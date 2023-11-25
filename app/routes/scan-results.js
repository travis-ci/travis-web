import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),
  needsAuth: true,
  tasks: service(),

  page: 1,

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    this.setProperties({ page });
    return this.modelFor('repo');
  },

  afterModel(model) {
    if (model && !model.error) {
      const scanResults = model.scanResults;
      scanResults.switchToPage(this.page);
      scanResults.on(PAGE_CHANGED, page => {
        const queryParams = { page };
        this.transitionTo({ queryParams });
      });
      return scanResults.load();
    }
  },

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'scan_results');
    }
  },

  titleToken() {
    return 'Scan Results';
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
  }
});
