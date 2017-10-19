import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service tabStates: null,

  titleToken(model) {
    return `Build #${model.get('number')}`;
  },

  serialize(model) {
    const id = model.get ? model.get('id') : model;
    return {
      build_id: id
    };
  },

  setupController(controller, model) {
    if (model && !model.get) {
      model = this.store.recordForId('build', model);
      this.store.find('build', model);
    }
    const repo = this.controllerFor('repo');
    controller.set('build', model);
    return repo.activate('build');
  },

  activate() {
    this.set('tabStates.mainTab', 'build');
  },

  model(params) {
    return this.store.findRecord('build', params.build_id);
  },

  afterModel(model) {
    const slug = this.modelFor('repo').get('slug');
    this.ensureBuildOwnership(model, slug);
    return this._super(...arguments);
  },

  ensureBuildOwnership(build, urlSlug) {
    const buildRepoSlug = build.get('repo.slug');

    if (buildRepoSlug !== urlSlug) {
      throw (new Error('invalidBuildId'));
    }
  },

  deactivate() {
    this._super(...arguments);
    this.controllerFor('job').set('job', null);
    return this.controllerFor('build').set('build', null);
  }
});
