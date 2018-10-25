import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default TravisRoute.extend({
  @service auth: null,

  needsAuth: false,

  queryParams: {
    page: {
      refreshModel: true
    },
    tab: {
      refreshModel: true
    },
  },

  @computed()
  recordsPerPage() {
    return config.pagination.profileReposPerPage;
  },

  model(params, transition) {
    if (typeof params.tab === 'string' && params.tab.toLowerCase() === 'insights') {
      return null;
    } else {
      let offset = (params.page - 1) * this.get('recordsPerPage');

      let queryParams = {
        offset,
        limit: this.get('recordsPerPage'),
        sort_by: 'default_branch.last_build:desc',
        custom: {
          owner: transition.params.owner.owner,
          type: 'byOwner',
        },
      };

      return this.store.paginated(
        'repo',
        queryParams,
        { live: false }
      );
    }
  },
});
