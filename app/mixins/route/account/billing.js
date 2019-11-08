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
    const billingInfo = this.store.createRecord('billing-info');
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      creditCardInfo,
    });
  },
});
