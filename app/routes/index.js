import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  auth: service(),
  tabStates: service(),
  repositories: service(),

  redirect() {
    if (this.get('auth.signedIn') && this.get('features.dashboard')) {
      this.transitionTo('dashboard');
    }
  },

  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      Ember.$('body').attr('id', 'home');

      this._super(args);

      this.render('repos', {
        outlet: 'left',
        into: 'index'
      });
    } else {
      return this._super(args);
    }
  },

  activate(...args) {
    this._super(args);
    if (this.get('auth.signedIn')) {
      const repositoryData = this.get('repositories.ownedRecords');
      if (Ember.isEmpty(repositoryData)) {
        this.controllerFor('repos').activate('owned');
      } else {
        this.controllerFor('repos').set('repos', repositoryData);
      }
      this.set('tabStates.mainTab', 'current');
      this.set('tabStates.sidebarTab', 'owned');
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
