import TravisRoute from 'travis/routes/basic';
import AccountBillingMixin from 'travis/mixins/route/account/billing';
import { hash } from 'rsvp';

const controllerName = 'account.billing';
export default TravisRoute.extend(AccountBillingMixin, {

  activate() {
    this.setupBillingStepSubscriptions(controllerName);
  },

  deactivate() {
    this.removeBillingStepSubscriptions(controllerName);
  },

  handleBillingStepChange() {
    const controller = this.controllerFor(controllerName);
    this.checkBillingStep(controller);
  },

  model() {
    return hash({
      account: this.modelFor('account'),
      newSubscription: this.newSubscription(),
    });
  }
});
