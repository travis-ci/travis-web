import TravisRoute from 'travis/routes/basic';
import AccountSharePlanMixin from 'travis/mixins/route/account/share_plan';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountSharePlanMixin, {
  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions && organization.permissions.plan_usage !== true) {
      this.router.transitionTo('organization.repositories', organization);
    }
    return hash({
      account: organization,
    });
  }
});
