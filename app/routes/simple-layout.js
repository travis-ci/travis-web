import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController: function() {
    $('body').attr('id', 'simple');
    this.controllerFor('repos').activate('owned');
    return this._super(...arguments);
  },
  renderTemplate: function() {
    return this._super(...arguments);
  }
});
