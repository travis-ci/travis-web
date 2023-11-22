import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Config',

  model() {
    return this.modelFor('build').request;
  },

  afterModel(request) {
    return request.fetchMessages.perform();
  }
});
