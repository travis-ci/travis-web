import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  store: service(),
  tasks: service(),
  titleToken: 'Config',

  model() {
    let build = this.modelFor('job').build
    let requestId = build.get('build.request.id') || build.belongsTo('request').id();
    return this.store.findRecord('request', requestId);
  },

  afterModel(request) {
    return this.tasks.fetchMessages.perform(request);
  }
});
