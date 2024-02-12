import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Config',

  model() {
    console.log("BUILD CONFIG!");
    return this.modelFor('build').get('request');
  },

  afterModel(request) {
    console.log("BUILD CONFIG!");
    //return request.fetchMessages.perform();
  }
});
