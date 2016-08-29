import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Experimental Features',

  renderTemplate() {
    // Ember.$('body').attr('id', 'profile');
    return this._super(...arguments);
  },

  model() {
    return this.store.findAll('feature');
  }
});
