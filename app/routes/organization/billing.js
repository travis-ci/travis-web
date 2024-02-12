import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import AccountBillingMixin from 'travis/mixins/route/account/billing';

export default TravisRoute.extend(AccountBillingMixin, {
  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions && organization.permissions.plan_view !== true) {
      this.router.transitionTo('organization.repositories', organization);
    }
    return hash({
      account: organization,
    });
  }
});
