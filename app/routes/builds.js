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
      this.set('tabStates.mainTab', 'builds');
      this.get('repositories.requestOwnedRepositories').perform();
    }
  },

  titleToken() {
    return 'Builds';
  },

  model() {
    return this.modelFor('repo').get('builds');
  },
});
