import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController: function () {
    Ember.$('body').attr('id', 'simple');
    this.controllerFor('repos').activate('owned');
    return this._super(...arguments);
  }
});
