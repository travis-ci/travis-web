import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  storage: service(),

  account: reads('model.account'),
  newSubscription: reads('model.newSubscription'),
  queryParams: ['billingStep'],
  billingStep: 1,

  actions: {
    setBillingStep(step) {
      this.set('billingStep', step);
    },
  }
});
