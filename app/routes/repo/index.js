import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  features: service(),
  tabStates: service(),
  router: service(),
  pusher: service(),

  afterModel(repo) {
    try {
      repo.get('currentBuild.request').then(request => request && request.fetchMessages.perform());
    } catch (error) {}
    Travis.pusher.subscribe(`repo-${repo.id}`);
    this.renderTemplate(repo);
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate('current');
    controller.set('repo', model);
  },

  deactivate() {
    console.log("DEACT");
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.controllerFor('repo').set('migrationStatus', null);
    this.stopObservingRepoStatus();
    return this._super(...arguments);
  },

  activate() {
    console.log("ACTIVATE");
    this.observeRepoStatus();
    this.set('tabStates.mainTab', 'current');
    return this._super(...arguments);
  },

  observeRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.addObserver('repo.active', this, 'renderTemplate');
    controller.addObserver('repo.currentBuildId', this, 'renderTemplate');
    console.log("OBSERVE");
    const repo = this.modelFor('repo');
    Travis.pusher.subscribe(`repo-${repo.id}`);
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
    const repo = this.modelFor('repo');
    console.log("STOP OBSERVING");
    Travis.pusher.unsubscribe(`repo-${repo.id}`);
  },

  beforeModel() {
    this.set('tabStates.mainTab', 'current');
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  },

  renderTemplate(repo) {
    console.log("RENDER TEMPLATE!");
    let controller = this.controllerFor('repo');
 //   this.set('tabStates.mainTab', 'current');
    console.log(this.get('tabStates.mainTab'));
    if (this.get('features.github-apps') &&
      repo.active_on_org &&
      controller.migrationStatus !== 'success') {
      this.router.transitionTo('repo.active-on-org');
    } else if (!repo.active) {
      console.log("NOT ACTIVE!");
      this.router.transitionTo('repo.not-active');
    } else if (!repo.currentBuildId) {

      console.log("NO BUILD!");
      this.router.transitionTo('repo.no-build');
    } else {
      console.log("TO BUILD");
      this.router.transitionTo('build.index', repo.currentBuildId);
    }
  }
});
