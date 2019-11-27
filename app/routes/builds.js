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
    const { id: repoId } = this.modelFor('repo');

    return this.store.query('build', {
      repository_id: repoId,
      event_type: ['push', 'api', 'cron'],
      limit: 25,
    });
  },
});
