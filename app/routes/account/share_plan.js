import TravisRoute from 'travis/routes/basic';
import AccountSharePlanMixin from 'travis/mixins/route/account/share_plan';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountSharePlanMixin, {
  model() {
    return hash({
      account: this.modelFor('account'),
    });
  }
});
