import Component from '@ember/component';
import { reads, or, not, and } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  isEditPlanLoading: reads('subscription.changePlan.isLoading'),

  isCanceled: reads('subscription.isCanceled'),
  isIncomplete: reads('subscription.isIncomplete'),
  isExpired: reads('subscription.isExpired'),
  isPending: reads('subscription.isPending'),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('isExpired'),
  isComplete: not('isIncomplete'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  showBillingInfo: and('subscription.isStripe', 'isCompleteAndNotExpired'),
  trial: reads('account.trial'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  isNotGithubTrial: not('isGithubTrial')
});
