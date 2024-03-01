import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),

  activate(...args) {
    console.log("BUILDS ACT");
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
    console.log("BMODEL");
    console.log(res.builds.length);
    console.log(res);
    console.log(res.builds);
    return res.builds;
  },

  beforeModel() {

    console.log("before BMODEL");
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {

    console.log("fetch allowance");
      repo.fetchRepoOwnerAllowance.perform();
    }
  }
});
