import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  getSubscription() {
    const billingInfo = this.store.createRecord('billing-info');
    const creditCardInfo = this.store.createRecord('credit-card-info');
    const plan = this.store.createRecord('plan');
    return this.store.createRecord('subscription', {
      billingInfo,
      creditCardInfo,
      plan
    });
  },

  model() {
    return hash({
      account: this.modelFor('organization'),
      plans: this.store.findAll('plan'),
      newSubscription: this.getSubscription()
    });
  }
});
