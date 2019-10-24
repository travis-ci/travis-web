import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Config',

  model() {
    return this.modelFor('job').get('build').then(build => {
      let requestId = build.get('build.request.id') || build.belongsTo('request').id();
      return this.store.findRecord('request', requestId);
    });
  },

  afterModel(request) {
    return request.fetchMessages.perform();
  }
});
