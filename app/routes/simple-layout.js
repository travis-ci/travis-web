import TravisRoute from 'travis/routes/basic';
import getOwner from 'ember-getowner-polyfill';

export default TravisRoute.extend({
  setupController: function() {
    $('body').attr('id', 'simple');
    this.controllerFor('repos').activate('owned');
    return this._super.apply(this, arguments);
  },
  renderTemplate: function() {
    return this._super.apply(this, arguments);
  }
});
