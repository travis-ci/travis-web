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
    const savedBillingInfo = JSON.parse(this.storage.billingInfo) || {};
    const savedPlan = JSON.parse(this.storage.billingPlan) || {};
    const plan = this.store.createRecord('plan', savedPlan);
    const billingInfo = this.store.createRecord('billing-info', savedBillingInfo);
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  },
});
