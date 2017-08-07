import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service tabStates: null,

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate('current');
    controller.set('repo', model);
  },

  deactivate() {
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
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

  renderTemplate() {
    let controller = this.controllerFor('repo');

    if (!controller.get('repo.active')) {
      this.render('repo/not-active');
    } else if (!controller.get('repo.currentBuildId')) {
      this.render('repo/no-build');
    } else {
      this.render('build');
    }
  }
});
