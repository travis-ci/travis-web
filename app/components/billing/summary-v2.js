import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { reads, or, not, and, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import isCurrentTrial from 'travis/utils/computed-is-current-trial';

export default Component.extend({

  accounts: service(),

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
  isSubscribed: computed('subscription.isSubscribed', function () {
    return this.subscription.isSubscribed;
  }),
  validto: computed('subscription.validTo', 'subscription.validToFromAddon', function () {
    return this.subscription.validToFromAddon || this.subscription.validTo;
  }),

  // Use an observer to fetch subscriptions if `subscription.validTo` is null
  onValidToChange: observer('subscription.validTo', function () {
    try {
      if (this.subscription.validTo == null) {
        this.accounts.fetchV2Subscriptions.perform();
      }
    } catch (e) {
      console.log(e);
    }
  }),
  isCurrentTrial: isCurrentTrial(),
  isExpired: or('subscription.isExpired', 'subscription.subscriptionExpiredByDate'),
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

  subscriptionExpiredPrefix: computed('subscription.validTo', function () {
    return Date.now() > Date.parse(this.subscription.validTo) ? 'Expired' : 'Expires';
  }),
});
