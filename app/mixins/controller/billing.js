import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  storage: service(),

  account: reads('model.account'),
  newSubscription: reads('model.newSubscription'),
  queryParams: ['billingStep'],
  billingStep: 1,

  init() {
    this._super(...arguments);
    this.clearBillingData();
    this.addObserver('billingStep', this, 'billingStepChange');
  },

  billingStepChange() {
    this.clearBillingData();
  },

  clearBillingData() {
    if (this.billingStep !== this.storage.billingStep) {
      this.storage.clearBillingData();
    }
  },

  actions: {
    setBillingStep(step) {
      this.set('billingStep', step);
    },
  }
});
