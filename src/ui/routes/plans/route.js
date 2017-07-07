import BasicRoute from "travis/src/ui/routes/basic";

export default BasicRoute.extend({
  needsAuth: false,

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
