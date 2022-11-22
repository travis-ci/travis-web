import TravisRoute from 'travis/routes/basic';
import AccountPlanUsageMixin from 'travis/mixins/route/account/plan_usage';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountPlanUsageMixin, {
  model() {
    return hash({
      account: this.modelFor('organization'),
    });
  }
});
