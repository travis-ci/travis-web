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
    if (controller.get('billingStep') === 1) {
      this.checkBillingStep(controller);
    }
    controller.set('newSubscription', this.newSubscription());
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

  setupBillingStepSubscriptions(controllerName) {
    const controller = this.controllerFor(controllerName);
    controller.addObserver('billingStep', this, 'handleBillingStepChange');
  },

  removeBillingStepSubscriptions(controllerName) {
    const controller = this.controllerFor(controllerName);
    controller.set('billingStep', 1);
    controller.removeObserver('billingStep', this, 'handleBillingStepChange');
  },

  checkBillingStep(controller) {
    const billingStepQueryParams = controller.get('billingStep');
    if (billingStepQueryParams !== this.storage.billingStep) {
      this.storage.clearBillingData();
    }
  },
});
