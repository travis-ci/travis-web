import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import AccountBillingMixin from 'travis/mixins/route/account/billing';

export default TravisRoute.extend(AccountBillingMixin, {
  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions.admin !== true) {
      this.transitionTo('organization.repositories', organization);
    }
    return hash({
      account: organization,
    });
  }
});
