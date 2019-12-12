import TravisRoute from 'travis/routes/basic';
import AccountBillingMixin from 'travis/mixins/route/account/billing';
import { hash } from 'rsvp';

const controllerName = 'organization.billing';
export default TravisRoute.extend(AccountBillingMixin, {

  activate() {
    this._super(...arguments);
    this.setupBillingStepSubscriptions(controllerName);
  },

  deactivate() {
    this.removeBillingStepSubscriptions(controllerName);
  },

  handleBillingStepChange() {
    const controller = this.controllerFor(controllerName);
    this.checkBillingStep(controller);
  },

  setupController(controller) {
    this._super(...arguments);
    if (controller.get('billingStep') === 1) {
      this.checkBillingStep(controller);
    }
  },

  model() {
    return hash({
      account: this.modelFor('organization'),
      newSubscription: this.newSubscription(),
    });
  }
});
