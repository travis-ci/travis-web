import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

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

  model({ page, tab }, transition) {
    if (typeof tab === 'string' && tab.toLowerCase() === 'insights') {
      const owner = this.modelFor('owner');
      owner.isUser = owner['@type'] === 'user';
      const buildInfo = this.get('insights').getChartData.perform(
        owner,
        'week',
        'builds',
        'sum',
        ['count_started'],
        { private: true }
      );
      return hash({ owner, buildInfo });
    } else {
      const limit = config.pagination.profileReposPerPage;
      const offset = (page - 1) * limit;
      const owner = this.paramsFor('owner').owner;
      const type = 'byOwner';
      const sort_by = 'default_branch.last_build:desc'; // eslint-disable-line

      const queryParams = { offset, limit, sort_by, custom: { owner, type, }};

      if (this.features.get('github-apps')) {
        queryParams['repository.active'] = true;
      }

      return this.store.paginated('repo', queryParams, { live: false });
    }
  }
});
