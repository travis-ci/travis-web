import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Profile',
  needsAuth: true,

  renderTemplate() {
    $('body').attr('id', 'profile');
    return this._super(...arguments);
  }
});
