import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Config',

  model() {
    return this.modelFor('build').get('request');
  },
});
