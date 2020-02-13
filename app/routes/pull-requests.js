import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'pull_requests');
    }
  },

  model() {
    const repo = this.modelFor('repo');
    const { fetchPullRequests } = repo;
    fetchPullRequests.perform();
    return fetchPullRequests;
  },

  titleToken() {
    return 'Pull Requests';
  },
});
