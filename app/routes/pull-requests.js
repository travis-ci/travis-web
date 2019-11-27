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
    const { id: repoId } = this.modelFor('repo');

    return this.store.query('build', {
      repository_id: repoId,
      event_type: 'pull_request',
      limit: 10,
    });
  },

  titleToken() {
    return 'Pull Requests';
  },
});
