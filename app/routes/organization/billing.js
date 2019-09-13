import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  stripe: service(),

  beforeModel() {
    return this.stripe.load();
  },

  newSubscription() {
    const billingInfo = this.store.createRecord('billing-info');
    const plan = this.store.createRecord('plan');
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      creditCardInfo,
      plan
    });
  },

  model() {
    return hash({
      account: this.modelFor('organization'),
      newSubscription: this.newSubscription()
    });
  }
});
