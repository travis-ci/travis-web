import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),

  titleToken: model => `Build #${model.number}`,

  serialize: model => ({
    build_id: model.get('id')
  }),

  model(params) {
    return this.store.findRecord('build', params.build_id);
  },

  afterModel(model) {
    const { slug } = this.modelFor('repo');
    this.ensureBuildOwnership(model, slug);
    return model.get('request').then(request => request && request.fetchMessages.perform());
  },

  setupController(controller, build) {
    const job = build.jobs.firstObject;
    const repo = this.modelFor('repo');
    this.controllerFor('repo').setProperties({ build, job });
    controller.setProperties({ build, repo });
  },

  activate() {
    this.tabStates.switchMainTabToBuild();
  },

  ensureBuildOwnership(build, urlSlug) {
    const buildRepoSlug = build.get('repo.slug');

    if (buildRepoSlug !== urlSlug) {
      throw new Error('invalidBuildId');
    }
  },
});
