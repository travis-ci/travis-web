import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import AccountBillingMixin from 'travis/mixins/route/account/billing';

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

  model() {
    return hash({
      account: this.modelFor('organization'),
    });
  }
});
