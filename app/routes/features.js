import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Beta Features',

  model() {
    return this.store.peekAll('beta-feature');
  },

  needsAuth: true
});
