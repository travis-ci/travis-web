import Ember from 'ember';
import MainTabRoute from 'travis/routes/main-tab';

export default MainTabRoute.extend({
  needsAuth: true,
  // reposTabName: 'owned',

  afterModel() {
    if (Ember.isEmpty(this.store.peekAll('repo'))) {
      return this.controllerFor('repos').possiblyRedirectToGettingStartedPage();
    }
  }
});
