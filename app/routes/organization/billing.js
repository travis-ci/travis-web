import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import AccountBillingMixin from 'travis/mixins/route/account/billing';

export default TravisRoute.extend(AccountBillingMixin, {
  model() {
    return hash({
      account: this.modelFor('organization'),
    });
  }
});
