// import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import getLiveModel from 'travis/utils/live-model';

export default TravisRoute.extend({
  needsAuth: true,

  features: service(),
  accounts: service(),
  store: service(),

  model(params) {
    const { store } = this;
    return getLiveModel({
      modelName: 'repo',
      query: {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      },
      filter: (repo) => repo.active && repo.starred,
      store,
    });

    // hash({
    // starredRepos: this.store.query('repo', {
    //   active: true,
    //   sort_by: 'current_build:desc',
    //   starred: true
    // }),
    // });
  },
});
