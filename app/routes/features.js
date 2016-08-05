import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Experimental Features',

  model() {
    return this.store.peekAll('feature');
  },

  needsAuth: true
});
