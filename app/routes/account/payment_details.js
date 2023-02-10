import TravisRoute from 'travis/routes/basic';
import AccountPaymentDetailsMixin from 'travis/mixins/route/account/payment_details';
import { hash } from 'rsvp';

export default TravisRoute.extend(AccountPaymentDetailsMixin, {
  model() {
    return hash({
      account: this.modelFor('account'),
    });
  }
});
