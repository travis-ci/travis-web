import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController: function () {
    Ember.$('body').attr('id', 'simple');
    return this._super(...arguments);
  }
});
