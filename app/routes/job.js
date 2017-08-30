import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service router: null,

  titleToken(model) {
    return `Job #${model.get('number')}`;
  },

  serialize(model/* , params*/) {
    let id = model.get ? model.get('id') : model;
    return {
      job_id: id
    };
  },

  setupController(controller, model) {
    let buildController, repo;
    if (model && !model.get) {
      model = this.store.recordForId('job', model);
      this.store.find('job', model);
    }
    repo = this.controllerFor('repo');
    controller.set('job', model);
    repo.activate('job');
    buildController = this.controllerFor('build');
    model.get('repo');
    let buildPromise = model.get('build');
    if (buildPromise) {
      buildPromise.then((build) => {
        build = this.store.recordForId('build', build.get('id'));
        return buildController.set('build', build);
      });
    }

    // this is a hack to not set favicon changes from build
    // controller while we're viewing job, this should go away
    // after refactoring of controllers
    return buildController.set('sendFaviconStateChanges', false);
  },

  model(params) {
    return this.store.find('job', params.job_id);
  },

  afterModel(job, transition) {
    const slug = transition.resolvedModels.repo.get('slug');
    this.ensureJobOwnership(job, slug);
    return this._super(...arguments);
  },

  ensureJobOwnership(job, urlSlug) {
    if (job.get('repositorySlug') !== urlSlug) {
      throw (new Error('invalidJobId'));
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
