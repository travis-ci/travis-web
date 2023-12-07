import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or, not, and, bool } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  selectedPlan: null,

  isEditPlanLoading: reads('subscription.changePlan.isLoading'),
  isIncomplete: reads('subscription.isIncomplete'),
  isComplete: not('isIncomplete'),
  authenticationNotRequired: not('subscription.clientSecret'),
  isPendingOverride: null,
  isPending: computed('subscription.isPending', 'authenticationNotRequired', 'isPendingOverride', function() {
    if (this.isPendingOverride !== null)
      return this.isPendingOverride
    return this.authenticationNotRequired && this.subscription.isPending;
  }),
  isNotCanceled: not('isCanceled'),
  isNotPending: not('isPending'),
  hasNotExpired: not('isExpired'),
  isCanceled: reads('subscription.isCanceled'),
  isSubscribed: reads('subscription.isSubscribed'),
  isExpired: or('subscription.isExpired', 'subscription.manualSubscriptionExpired'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
  isCompleteAndNotExpired: and('hasNotExpired', 'isComplete'),
  trial: reads('account.trial'),
  isGithubSubscription: reads('subscription.isGithub'),
  expiredStripeSubscription: reads('account.expiredStripeSubscription'),
  hasExpiredStripeSubscription: bool('expiredStripeSubscription'),
  showPlanInfo: computed('showPlansSelector', 'showAddonsSelector', function () {
    console.log("I am computed")
    console.log(!this.showPlansSelector)
    console.log(!this.showAddonsSelector)
    return !this.showPlansSelector && !this.showAddonsSelector;
  }),
  showUserManagementModal: false,
});
