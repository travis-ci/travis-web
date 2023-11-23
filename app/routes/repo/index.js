import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  features: service(),
  tabStates: service(),

  afterModel(repo) {
    try {
      return repo.get('currentBuild.request').then(request => request && request.fetchMessages.perform());
    } catch (error) {}
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
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  },

  renderTemplate() {
    let controller = this.controllerFor('repo');

    if (this.get('features.github-apps') &&
      controller.get('repo.active_on_org') &&
      controller.migrationStatus !== 'success') {
      this.render('repo/active-on-org');
    } else if (!controller.get('repo.active')) {
      this.render('repo/not-active');
    } else if (!controller.get('repo.currentBuildId')) {
      this.render('repo/no-build');
    } else {
      this.render('build');
      this.render('build/index', { into: 'build', controller: 'build' });
    }
  }
});
