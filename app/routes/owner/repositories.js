import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { OWNER_TABS } from 'travis/controllers/owner/repositories';

export default TravisRoute.extend({
  features: service(),
  insights: service(),

  needsAuth: false,

  queryParams: {
    page: {
      refreshModel: true
    },
    tab: {
      refreshModel: true
    },
  },

  page: null,
  tab: null,
  owner: null,

  model({ page, tab }, transition) {
    const owner = this.modelFor('owner');

    this.setProperties({ tab, page, owner });

    return { owner };
  },

  loadRepositories() {
    const limit = config.pagination.profileReposPerPage;
    const page = this.page || 1;
    const offset = (page - 1) * limit;
    const owner = this.paramsFor('owner').owner;
    const type = 'byOwner';
    const sort_by = 'default_branch.last_build:desc'; // eslint-disable-line

    const queryParams = { offset, limit, sort_by, custom: { owner, type, }};

    if (this.features.get('github-apps')) {
      queryParams['repository.active'] = true;
    }
    return this.store.paginated('repo', queryParams, { live: false });
  },

  loadInsights() {
    return this.get('insights').getChartData.perform(
      this.owner,
      'week',
      'builds',
      'sum',
      ['count_started'],
      { private: true }
    );
  },

  loadData(controller) {
    controller.setProperties({ builds: null, repos: null });

    if (this.tab === OWNER_TABS.INSIGHTS) {
      controller.set('builds', this.loadInsights());
    } else {
      this.loadRepositories().then(data => controller.set('repos', data));
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.loadData(controller);
  }
});
