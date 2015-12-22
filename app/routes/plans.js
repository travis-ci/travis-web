import BasicRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default BasicRoute.extend({
  needsAuth: false,

  redirect() {
    if (!config.pro) {
      return this.transitionTo('/');
    }
  }
});
