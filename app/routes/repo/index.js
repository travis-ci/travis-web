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
    return this._super(...arguments);
  },


  // here
  activate() {
    this.set('tabStates.mainTab', 'current');
    return this._super(...arguments);
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  },
});
