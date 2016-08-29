import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.store.findAll('feature');
  }
});
