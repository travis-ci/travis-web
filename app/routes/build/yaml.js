import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.modelFor('build').get('request');
  }
});
