import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  features: service(),
  tabStates: service(),

  model() {
    const repo = this.modelFor('repo');
    const build = repo.currentBuild;
    return { repo, build };
  },

  afterModel({ build }) {
    try {
      return build.get('request').then(request => request && request.fetchMessages.perform());
    } catch (error) {}
  },

  setupController(controller, { repo, build }) {
    const repoController = this.controllerFor('repo');
    const job = build.get('jobs.firstObject');

    repoController.setProperties({ build, job });
    controller.setProperties({ repo, build });
  },

  activate() {
    this.controllerFor('repo').activate('current');
    return this._super(...arguments);
  },

  renderTemplate(controller, { repo, build }) {
    const repoController = this.controllerFor('repo');
    const buildController = this.controllerFor('build');
    buildController.setProperties({ repo, build });

    if (this.get('features.github-apps') &&
      repo.get('active_on_org') &&
      repoController.migrationStatus !== 'success') {
      this.render('repo/active-on-org');
    } else if (!repo.active) {
      this.render('repo/not-active');
    } else {
      this.render('build');
      this.render('build/index', { into: 'build', controller: buildController });
    }
  }
});
