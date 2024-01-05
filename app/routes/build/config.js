import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service'

export default TravisRoute.extend({
  titleToken: 'Config',
  tasks: service(),

  model() {
    return this.modelFor('build').request;
  },

  afterModel(request) {
    return this.tasks.fetchMessages.perform(request);
  }
});
