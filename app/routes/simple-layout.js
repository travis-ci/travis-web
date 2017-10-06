import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController: function () {
    $('body').attr('id', 'simple');
    return this._super(...arguments);
  }
});
