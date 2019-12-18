import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  stripe: service(),
  store: service(),
  storage: service(),

  beforeModel() {
    return this.stripe.load();
  },

  setupController(controller) {
    this._super(...arguments);
    this.checkBillingStep();
    controller.set('newSubscription', this.newSubscription());
  },

  deactivate() {
    this._super(...arguments);
    this.controller.set('billingStep', 1);
  },

  newSubscription() {
    const savedPlan = this.storage.billingPlan;
    const selectedPlan = savedPlan && savedPlan.id && this.store.peekRecord('plan', savedPlan.id);
    const plan = selectedPlan || this.store.createRecord('plan', this.storage.billingPlan);
    const billingInfo = this.store.createRecord('billing-info', this.storage.billingInfo);
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  },

  checkBillingStep() {
    const billingStepQueryParams = this.controller.get('billingStep');
    if (billingStepQueryParams !== this.storage.billingStep) {
      this.storage.clearBillingData();
    }
  },
});
