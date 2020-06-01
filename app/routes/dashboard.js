// import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import getLiveModel from 'travis/utils/live-model';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';
import config from 'travis/config/environment';

const { dashboardReposPerPage: limit } = config.pagination;


export default TravisRoute.extend({
  needsAuth: true,

  features: service(),
  accounts: service(),
  store: service(),

  model(params) {
    const { store } = this;
    const liveModel = getLiveModel({
      store,
      modelName: 'repo',
      query: {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      },
      filterFn: (repo) => !!repo.active && !!repo.starred,
      filterKeys: ['active', 'starred'],
      sortFn: dashboardRepositoriesSort,
      limit,
    });

    return liveModel;
  },
});
