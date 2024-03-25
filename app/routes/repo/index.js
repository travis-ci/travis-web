/* global Travis */
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
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.controllerFor('repo').set('migrationStatus', null);
    this.stopObservingRepoStatus();
    return this._super(...arguments);
  },

  activate() {
    this.observeRepoStatus();
    this.set('tabStates.mainTab', 'current');
    return this._super(...arguments);
  },

  observeRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.addObserver('repo.active', this, 'renderTemplate');
    controller.addObserver('repo.currentBuildId', this, 'renderTemplate');
    const repo = this.modelFor('repo');

    Travis.pusher.subscribe(`repo-${repo.id}`);
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
    const repo = this.modelFor('repo');
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
    let controller = this.controllerFor('repo');
    //   this.set('tabStates.mainTab', 'current');
    if (this.get('features.github-apps') &&
      repo.active_on_org &&
      controller.migrationStatus !== 'success') {
      this.router.transitionTo('repo.active-on-org');
    } else if (!repo.active) {
      this.router.transitionTo('repo.not-active');
    } else if (!repo.currentBuildId) {
      this.router.transitionTo('repo.no-build');
    } else {
      this.router.transitionTo('build.index', repo.currentBuildId);
    }
  }
});
