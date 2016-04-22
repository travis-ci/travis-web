import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken(model) {
    return "Job #" + (model.get('number'));
  },

  serialize(model, params) {
    var id;
    id = model.get ? model.get('id') : model;
    return {
      job_id: id
    };
  },

  setupController(controller, model) {
    var buildController, buildPromise, repo;
    if (model && !model.get) {
      model = this.store.recordForId('job', model);
      this.store.find('job', model);
    }
    repo = this.controllerFor('repo');
    this.controllerFor('job').set('job', model);
    repo.activate('job');
    buildController = this.controllerFor('build');
    model.get('repo');
    if (buildPromise = model.get('build')) {
      buildPromise.then( (build) => {
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

  deactivate() {
    var buildController;
    buildController = this.controllerFor('build');
    buildController.set('sendFaviconStateChanges', true);
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    return this._super(...arguments);
  }

});
