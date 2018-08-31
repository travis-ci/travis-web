import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.store.query('request', {
      repository_id: this.modelFor('repo').get('id')
    });
  }
});
