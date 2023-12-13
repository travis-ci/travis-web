import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  store: service(),
  tasks: service(),

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
      model = this.store.findRecord('build', model);
      this.store.find('build', model);
    }
    const currentTab = controller.currentTab
    this.tabStates.setMainTab(currentTab || 'build');
    const repo = this.controllerFor('repo');
    controller.set('build', model);
    if (!currentTab)
      return repo.activate('build');
  },

  model(params) {
    return this.store.findRecord('build', params.build_id);
  },

  afterModel(model) {
    const slug = this.modelFor('repo').slug;
    this.ensureBuildOwnership(model, slug);
    return model.get('request').then(request => request && this.tasks.fetchMessages.perform(request));
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
       this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
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
