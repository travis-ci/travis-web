import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Build config',

  model() {
    return this.modelFor('build').get('request');
  },
});
