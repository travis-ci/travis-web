import BasicRoute from "travis/src/ui/routes/basic";

export default BasicRoute.extend({

  model() {
    return { landingPage: true };
  },

  setupController(controller/* , model*/) {
    return controller.set('repos', this.get('repos'));
  }
});
