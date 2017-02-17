import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  resetController(controller, isExiting/* , transition*/) {
    if (isExiting) {
      controller.set('message', null);
      controller.set('layoutName', null);
    }
  }
});
