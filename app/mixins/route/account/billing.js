import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  stripe: service(),
  store: service(),
  storage: service(),

  beforeModel() {
    return this.stripe.load();
  },

  newSubscription() {
    const plan = this.store.createRecord('plan', this.storage.billingPlan);
    const billingInfo = this.store.createRecord('billing-info', this.storage.billingInfo);
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  },
});
