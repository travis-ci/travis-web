import Component from '@ember/component';
import { reads, or, not, and } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  isEditPlanLoading: reads('subscription.changePlan.isLoading'),
  isIncomplete: reads('subscription.isIncomplete'),
  authenticationNotRequired: not('subscription.clientSecret'),
  isPending: and('subscription.isPending', 'authenticationNotRequired'),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('isExpired'),
  isComplete: not('isIncomplete'),
  isCanceled: reads('subscription.isCanceled'),
  isSubscribed: reads('subscription.isSubscribed'),
  isExpired: or('subscription.isExpired', 'subscription.manualSubscriptionExpired'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  showBillingInfo: and('subscription.isStripe', 'isCompleteAndNotExpired'),
  trial: reads('account.trial'),
  isGithubSubscription: reads('subscription.isGithub'),
  isGithubTrial: and('isGithubSubscription', 'trial.hasActiveTrial'),
  isNotGithubTrial: not('isGithubTrial')
});
