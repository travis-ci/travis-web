import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  features: service(),
  tabStates: service(),
  tasks: service(),
  router: service(),
  setupController(controller, model) {
    this._super(...arguments);
    this.activate();
    this.controllerFor('repo').activate('current');
    controller.set('repo', model);
  },

  deactivate() {
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.controllerFor('repo').set('migrationStatus', null);
    return this._super(...arguments);
  },

  activate() {
    this.tabStates.setMainTab('current');
    return this._super(...arguments);
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
  },

  afterModel(repo, _transition) {
    try {
      repo.get('currentBuild.request').then(request => request && this.tasks.fetchMessages.perform(request));
    } catch (error) {}

    if (this.get('features.github-apps') &&
      repo.active_on_org &&
      repo.migrationStatus !== 'success') {
      this.transitionTo('repo.active-on-org');
    } else if (!repo.active) {
      this.transitionTo('repo.not-active');
    } else if (!repo.currentBuildId) {
      this.transitionTo('repo.no-build');
    } else {
      this.transitionTo('build.index', repo.currentBuildId, { queryParams: { currentTab: 'current' } });
    }
  }
});
