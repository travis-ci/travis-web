import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  auth: service(),
  tabStates: service(),

  redirect() {
    if (this.get('auth.signedIn')) {
      if (this.get('features.dashboard')) {
        this.transitionTo('dashboard');
      }
    } else if (this.get('features.enterprise')) {
      this.transitionTo('auth');
    }
  },

  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      Ember.$('body').attr('id', 'home');

      this._super(args);
    } else {
      return this._super(args);
    }
  },

  activate(...args) {
    this._super(args);
    if (this.get('auth.signedIn')) {
      this.get('tabStates').set('sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'current');
      this.controllerFor('repos').activate('owned');
    }
  },

  deactivate() {
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.stopObservingRepoStatus();
    return this._super(...arguments);
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
  },

  actions: {
    redirectToGettingStarted() {
      return this.transitionTo('getting_started');
    },
  },
});
