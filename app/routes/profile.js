import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Profile',
  needsAuth: true,

  renderTemplate() {
    Ember.$('body').attr('id', 'profile');
    return this._super(...arguments);
  }
});
