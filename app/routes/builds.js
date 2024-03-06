import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),

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
    let res =  this.modelFor('repo');
    return res.builds;
  },

  beforeModel() {

    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  }
});
