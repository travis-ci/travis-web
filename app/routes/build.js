import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  tabStates: service(),

  titleToken(model) {
    return 'Build #' + (model.get('number'));
  },

  serialize(model/* , params*/) {
    var id;
    id = model.get ? model.get('id') : model;
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
    return this.store.find('build', params.build_id);
  },

  deactivate() {
    this._super(...arguments);
    this.controllerFor('job').set('job', null);
    return this.controllerFor('build').set('build', null);
  }
});
