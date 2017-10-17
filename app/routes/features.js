import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Beta Features',

  model() {
    return this.store.peekAll('beta-feature').sortBy('name');
  },

  renderTemplate() {
    $('body').attr('class', 'features');
    this._super(...arguments);
  },

  needsAuth: true
});
