import TravisRoute from "travis/src/ui/routes/basic";

export default TravisRoute.extend({
  resetController(controller, isExiting/* , transition*/) {
    if (isExiting) {
      controller.set('message', null);
      controller.set('layoutName', null);
    }
  }
});
