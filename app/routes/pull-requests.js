import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  repositories: service(),
  tabStates: service(),

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'pull_requests');
      this.get('repositories.requestOwnedRepositories').perform();
    }
  },

  model() {
    return this.modelFor('repo').get('pullRequests');
  },

  titleToken() {
    return 'Pull Requests';
  },
});
