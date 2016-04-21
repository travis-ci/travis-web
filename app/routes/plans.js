import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  needsAuth: false,

  redirect() {
    if (!this.features.isEnabled('pro')) {
      return this.transitionTo('/');
    }
  }
});
