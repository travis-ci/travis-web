import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,

  model() {
    let accountCompound = this.modelFor('account');
    return accountCompound.account.get('subscription');
  },

  // FIXME without this, switching between accounts doesn’t update the billing information?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
