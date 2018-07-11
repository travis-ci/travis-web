import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  model() {
    let accountCompound = this.modelFor('account');
    return hash({
      subscriptions: accountCompound.account.get('subscription'),
      trials: this.store.findBy('trial'),
    });
  },

  // without this, switching between accounts doesn’t update the billing information?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
