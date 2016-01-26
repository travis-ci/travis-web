import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  needsAuth: false,

  activate: function() {
    if (config.enterprise) {
      return  this.transitionTo('auth');
    }
  }
});
