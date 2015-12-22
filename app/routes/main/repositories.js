import MainTabRoute from 'travis/routes/main-tab';

export default MainTabRoute.extend({
  needsAuth: true,
  reposTabName: 'owned',

  afterModel() {
    return this.controllerFor('repos').possiblyRedirectToGettingStartedPage();
  }
});
