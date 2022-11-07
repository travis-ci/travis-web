import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  auth: service(),
  needsAuth: true,

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'scan_result');
    }
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (!this.auth.currentUser.hasPushAccessToRepo(repo)) {
      this.transitionTo('scanResults');
    }
  },

  titleToken() {
    return 'Scan Result';
  }
});
