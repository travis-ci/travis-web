import Component from '@ember/component';
import { reads, or, not, and } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  cancelSubscription: reads('subscription.cancelSubscription'),
  resubscribe: reads('subscription.resubscribe'),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  resubscribeLoading: reads('subscription.resubscribe.isRunning'),
  canceledOrExpired: or('subscription.isExpired', 'subscription.isCanceled'),
  isCanceled: reads('subscription.isCanceled'),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('subscription.isExpired'),
  isIncomplete: reads('subscription.isIncomplete'),
  isComplete: not('isIncomplete'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  showBillingInfo: and('subscription.isStripe', 'isCompleteAndNotExpired'),
  canCancelSubscription: and('isNotCanceled', 'account.hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'account.hasSubscriptionPermissions'),
});
