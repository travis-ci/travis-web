import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),
  tasks: service(),
  refreshService: service(),

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
    }
    this.set('tabStates.mainTab', 'builds');
  },

  titleToken() {
    return 'Builds';
  },

  model() {
    const that = this;
    const repo = this.modelFor('repo');
    repo.addObserver('buildsRefreshToken', function () {
        that.refresh()
      }
    );
    return repo.builds;
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
