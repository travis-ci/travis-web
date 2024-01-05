import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  store: service(),
  tasks: service(),
  titleToken: 'Config',

  model() {
    let build = this.modelFor('job').build
    return build.then((build_) => {
      let requestId = build_.get('build.request.id') || build_.belongsTo('request').id();
      return this.store.findRecord('request', requestId);
    });
  },

  afterModel(request) {
    return this.tasks.fetchMessages.perform(request);
  }
});
