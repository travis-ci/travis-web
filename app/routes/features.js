import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Experimental Features',

  model() {
    return this.store.findAll('feature');
  },

  actions: {
    toggleFeature(feature) {
      feature.toggleProperty('enabled');
      feature.save();
    }
  },

  needsAuth: true
});
