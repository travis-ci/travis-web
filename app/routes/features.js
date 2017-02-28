import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

export default TravisRoute.extend({
  titleToken: 'Beta Features',

  model() {
    return this.store.peekAll('beta-feature').sortBy('name');
  },

  renderTemplate() {
    Ember.$('body').attr('class', 'features');
    this._super(...arguments);
  },

  needsAuth: true
});
