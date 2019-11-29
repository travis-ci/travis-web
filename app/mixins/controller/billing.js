import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  storage: service(),

  account: reads('model.account'),
  newSubscription: reads('model.newSubscription'),
  queryParams: ['billingStep'],
  billingStep: 1,
  lastStep: 3,

  actions: {
    nextBillingStep() {
      const nextStep = Math.min(this.lastStep, this.billingStep + 1);
      this.set('billingStep', nextStep);
    },

    prevBillingStep() {
      const prevStep = Math.max(1, this.billingStep - 1);
      this.set('billingStep', prevStep);
    },
  },
});
