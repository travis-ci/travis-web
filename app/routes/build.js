import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
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
    var repo;
    if (model && !model.get) {
      model = this.store.recordForId('build', model);
      this.store.find('build', model);
    }
    repo = this.controllerFor('repo');
    this.controllerFor('build').set('build', model);
    return repo.activate('build');
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
