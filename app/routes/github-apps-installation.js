import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return {};
  },

  setupController(controller, model) {
    controller.startPolling();
  }
});
