import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  titleToken: 'Config',
  store: service(),

  model() {
    return this.modelFor('job').get('build').then(build => {
      let requestId = build.get('build.request.id') || build.belongsTo('request').id();
      return this.store.findRecord('request', requestId);
    });
  },

  afterModel(request) {
 //   request.fetchMessages.perform();
  }
});
