import Component from '@ember/component';
import { reads, or, not, and } from '@ember/object/computed';

export default Component.extend({
  subscription: null,
  account: null,

  isCanceled: reads('subscription.isCanceled'),
  isIncomplete: reads('subscription.isIncomplete'),
  isExpired: reads('subscription.isExpired'),
  isPending: reads('subscription.isPending'),
  resubscribe: reads('subscription.resubscribe'),
  cancelSubscription: reads('subscription.cancelSubscription'),
  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  resubscribeLoading: reads('subscription.resubscribe.isRunning'),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('isExpired'),
  isComplete: not('isIncomplete'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  showBillingInfo: and('subscription.isStripe', 'isCompleteAndNotExpired'),
  canCancelSubscription: and('isNotCanceled', 'account.hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'account.hasSubscriptionPermissions'),
});
