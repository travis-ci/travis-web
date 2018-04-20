import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({
  model() {
    return {};
  },

  setupController(controller, model) {
    controller.startPolling();
  }
});
