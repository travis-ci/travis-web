import TravisRoute from 'travis/routes/basic';
import AccountPlanUsageMixin from 'travis/mixins/route/account/plan_usage';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountPlanUsageMixin, {
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
