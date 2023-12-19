import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tasks: service(),
  setupController() {
    this._super(...arguments);
    return this.controllerFor('repo').activate('requests');
  },

  model() {
    const that = this;
    const repo = this.modelFor('repo');
    repo.addObserver('requestsRefreshToken', function () {
        that.refresh()
      }
    );

    return this.modelFor('repo').requests;
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
       this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
  },
  refreshRoute() {
    this.refresh();
  },
});
