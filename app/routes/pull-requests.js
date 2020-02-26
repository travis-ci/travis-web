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
    return this.store.query('build', {
      event_type: 'pull_request',
      repository_id: repo.id,
    });
  },

  titleToken() {
    return 'Pull Requests';
  },
});
