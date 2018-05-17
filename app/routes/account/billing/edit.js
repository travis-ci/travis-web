import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,

  model() {
    return this.store.findAll('plan');
  },

  setupController(controller, model) {
    controller.set('plans', model);
  }
});
