import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { OWNER_TABS } from 'travis/controllers/owner/repositories';

export default TravisRoute.extend({
  features: service(),
  insights: service(),
  store: service(),
  accounts: service(),

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

  model({ page, tab }) {
    const owner = this.modelFor('owner');

    this.setProperties({ tab, page, owner });

    return { owner };
  },

  afterModel() {
    if (this.tab === OWNER_TABS.CUSTOM_IMAGES) {
      return this.accounts.fetchV2Subscriptions.perform();
    }
  },

  loadRepositories() {
    const limit = config.pagination.profileReposPerPage;
    const page = this.page || 1;
    const offset = (page - 1) * limit;
    const { owner, provider } = this.paramsFor('owner');
    const type = 'byOwner';
    const sortBy = 'default_branch.last_build:desc'; // eslint-disable-line

    const queryParams = { offset, limit, sortBy, provider, custom: { owner, type, }};

    if (this.features.get('github-apps')) {
      queryParams['repository.active'] = true;
    }
    return this.store.paginated('repo', queryParams, { live: false });
  },

  loadInsights() {
    return this.insights.getChartData.perform(
      this.owner,
      'week',
      'builds',
      'sum',
      ['count_started'],
      { private: true }
    );
  },

  loadData() {
    const { controller } = this;
    controller.setProperties({ builds: null, repos: null });

    if (this.tab === OWNER_TABS.INSIGHTS) {
      controller.set('builds', this.loadInsights());
    } else if (this.tab === OWNER_TABS.CUSTOM_IMAGES) {
      const owner = this.modelFor('owner');
      const subscription = owner.v2subscription;
      const storageAddon = subscription?.addons?.find(addon => addon.type === 'storage');
      if (!storageAddon) {
        this.transitionTo('account.repositories');
        return;
      }
    } else {
      this.loadRepositories().then(data => controller.set('repos', data));
    }
  },

  setupController() {
    this._super(...arguments);
    this.loadData();
  }
});
