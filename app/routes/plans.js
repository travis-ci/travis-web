import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  needsAuth: false,

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
