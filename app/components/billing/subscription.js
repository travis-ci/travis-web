import Component from '@ember/component';
import { reads, bool, empty, not } from '@ember/object/computed';

export default Component.extend({
  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  hasExpiredStripeSubscription: bool('account.expiredStripeSubscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('account.v2subscription'),
  hasV2Subscription: not('isV2SubscriptionEmpty'),
  hasExpiredStripev2Subscription: bool('account.expiredStripev2Subscription'),
});
