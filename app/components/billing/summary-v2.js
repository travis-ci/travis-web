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
  isPending: and('subscription.isPending', 'authenticationNotRequired'),
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
    return !this.showPlansSelector && !this.showAddonsSelector;
  }),
  showUserManagementModal: false,
  pricePerUser: computed('subscription', function () {
    const subscription = this.get('subscription');
    const plan = subscription.get('plan');
    const startingPrice = plan.get('startingPrice');
    const startingUsers = plan.get('startingUsers');

    if (subscription.isManual && startingPrice && startingUsers) {
      return (startingPrice / startingUsers).toFixed(2);
    }

    return 0;
  }),
});
