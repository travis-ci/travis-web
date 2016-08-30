import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Experimental Features',

  model() {
    return this.store.findAll('feature');
  },

  needsAuth: true
});
