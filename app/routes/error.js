import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('message', null);
      controller.set('layoutName', null);
    }
  }
});
