import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  router: service(),
  store: service(),

  titleToken(model) {
    return `Job #${model.get('number')}`;
  },

  serialize(model /* , params*/) {
    let id = model.get ? model.get('id') : model;
    return {
      job_id: id
    };
  },

  async setupController(controller, model) {
    let buildController, repo;

    if (model && !model.get) {
      model = await this.store.findRecord('job', model, { reload: true });
    }
    repo = this.controllerFor('repo');
    controller.set('job', model);
    repo.activate('job');
    buildController = this.controllerFor('build');
    await model.get('repo');
    let buildPromise = model.get('build');
    if (buildPromise) {
      buildPromise.then(build => {
        build = this.store.peekRecord('build', build.get('id'));
        return buildController.set('build', build);
      });
    }

    // this is a hack to not set favicon changes from build
    // controller while we're viewing job, this should go away
    // after refactoring of controllers
    return buildController.set('sendFaviconStateChanges', false);
  },

  model(params) {
    return this.store.findRecord('job', params.job_id);
  },

  async afterModel(job) {
    const slug = this.modelFor('repo').get('slug');

    await job.get('repo');

    this.ensureJobOwnership(job, slug);

    job.get('build').then((build) => {
      if (build && build.request) {
        build.request.fetchMessages.perform();
      }
    });
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  },

  ensureJobOwnership(job, urlSlug) {
    const jobSlug = job.get('repositorySlug') || job.get('repo.slug');
    const repoVcsSlug = job.get('repo.vcsSlug');
    if (jobSlug !== urlSlug && repoVcsSlug !== urlSlug) {
      return;
    }
  },

  deactivate() {
    let buildController;
    buildController = this.controllerFor('build');
    buildController.set('sendFaviconStateChanges', true);
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    return this._super(...arguments);
  }
});
