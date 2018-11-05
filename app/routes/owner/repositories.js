import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service features: null,

  needsAuth: false,

  queryParams: {
    page: {
      refreshModel: true
    },
  },

  model({ page }, transition) {
    const limit = config.pagination.profileReposPerPage;
    const offset = (page - 1) * limit;
    const owner = transition.params.owner.owner;
    const type = 'byOwner';
    const sort_by = 'default_branch.last_build:desc'; // eslint-disable-line

    const queryParams = { offset, limit, sort_by, custom: { owner, type, }};

    if (this.features.get('github-apps')) {
      queryParams['repository.active'] = true;
    }

    return this.store.paginated('repo', queryParams, { live: false });
  }
});
