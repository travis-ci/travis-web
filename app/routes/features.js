import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Beta Features',

  model() {
    return this.store.peekAll('beta-feature');
  },

  renderTemplate() {
    Ember.$('body').attr('class', 'features');
    this._super(...arguments);
  },

  needsAuth: true
});
