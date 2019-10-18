import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  stripe: service(),
  store: service(),

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
});
