import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or, not, and, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import isCurrentTrial from 'travis/utils/computed-is-current-trial';
import moment from 'moment';

const VALID_TO_FETCH_MAX_ATTEMPTS = 2;

export default Component.extend({

  accounts: service(),
  storage: service(),

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


  subtractOneDay(date) {
    return moment(date).subtract(1, 'days').format('MMMM D, YYYY');
  },

  validto: computed('subscription.validTo', function () {
    try {
      if (this.subscription.validTo == null && this.storage.subscriptionValidToAttempts < VALID_TO_FETCH_MAX_ATTEMPTS) {
        this.storage.subscriptionValidToAttempts++;
        this.accounts.fetchV2Subscriptions.perform();
      }
    } catch (e) {
      console.log(e);
    }
    return this.subscription.validTo || this.subscription.validToFromAddon;
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
