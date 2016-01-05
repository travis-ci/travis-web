import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController: function() {
    $('body').attr('id', 'simple');
    this.container.lookup('controller:repos').activate('owned');
    return this._super.apply(this, arguments);
  },
  renderTemplate: function() {
    return this._super.apply(this, arguments);
  }
});
