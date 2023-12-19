import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),
  tasks: service(),

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'pull_requests');
    }
  },

  model() {
    const that = this;
    const repo = this.modelFor('repo');
    repo.addObserver('requestsRefreshToken', function () {
      that.refresh()
    });
    return repo;
  },

  titleToken() {
    return 'Pull Requests';
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
  }
});
