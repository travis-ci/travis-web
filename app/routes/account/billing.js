import TravisRoute from 'travis/routes/basic';
import AccountBillingMixin from 'travis/mixins/route/account/billing';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountBillingMixin, {
  model() {
    return hash({
      account: this.modelFor('account'),
    });
  }
});
