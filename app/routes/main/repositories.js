import Ember from 'ember';
import MainTabRoute from 'travis/routes/main-tab';

const { service } = Ember.inject;

export default MainTabRoute.extend({
  tabStates: service(),

  needsAuth: true,

  activate() {
    if (this.get('tabStates.sidebarTab') === 'search') {
      this.get('tabStates').set('sidebarTab', 'owned');
    }
  },

  afterModel() {
    if (Ember.isEmpty(this.store.peekAll('repo'))) {
      return this.controllerFor('repos').possiblyRedirectToGettingStartedPage();
    }
  },

  redirect() {
    if (this.get('features.dashboard')) {
      return this.transitionTo('dashboard');
    }
  }
});
