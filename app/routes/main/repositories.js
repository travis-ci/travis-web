import Ember from 'ember';
import MainTabRoute from 'travis/routes/main-tab';

const { service } = Ember.inject;

export default MainTabRoute.extend({
  tabStates: service(),
  repositories: service(),

  needsAuth: true,

  activate() {
    this.get('tabStates').set('sidebarTab', 'owned');
    this.get('repositories.requestOwnedRepositories').perform();
  },

  afterModel() {
    if (Ember.isEmpty(this.store.peekAll('repo'))) {
      return this.controllerFor('repos').possiblyRedirectToGettingStartedPage();
    }
  }
});
