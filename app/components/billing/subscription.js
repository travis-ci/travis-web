import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, bool } from '@ember/object/computed';

export default Component.extend({
  plan: service(),

  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  hasExpiredStripeSubscription: bool('account.expiredStripeSubscription'),
  plans: reads('plan.plans')
});
