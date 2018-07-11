import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  model() {
    let accountCompound = this.modelFor('account');
    return accountCompound.account.get('subscription');
  },

  // without this, switching between accounts doesn’t update the billing information?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
