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
    controller.set('selectedPlan', this.selectedPlan());
  },

  deactivate() {
    this._super(...arguments);
    this.controller.set('billingStep', 1);
  },

  afterModel(model) {
    if (model && !model.error) {
      model.account.fetchV2Plans.perform();
    }
  },

  selectedPlan() {

    console.log("SELECTED PLAN0");
    const savedPlan = this.storage.billingPlan;
    console.log(`saved: ${JSON.stringify(savedPlan)}`);
    const selectedPlan = savedPlan && savedPlan.id && this.store.peekRecord('v2-plan-config', savedPlan.id);
    console.log("SELECTED PLAN");
    console.log(selectedPlan);
    return selectedPlan || this.store.createRecord('v2-plan-config', this.storage.billingPlan);
  },

  checkBillingStep() {
    const billingStepQueryParams = this.controller.get('billingStep');
    if (billingStepQueryParams !== this.storage.billingStep) {
      this.storage.clearBillingData();
    }
  },
});
