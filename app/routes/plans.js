import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  needsAuth: false,

  redirect() {
    if (!this.features.pro) {
      return this.transitionTo('/');
    }
  }
});
