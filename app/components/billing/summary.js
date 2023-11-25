import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or, not, and, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  subscription: null,
  account: null,

  selectedPlanOverride: null,

  selectedPlanV: computed('selectedPlanOverride', 'subscription.plan',  function () {
    if (this.selectedPlanOverride !== null)
      return this.selectedPlanOverride;

    return this.subscription.plan
  }),
  selectedPlan: reads('subscription.plan'),

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

  invoices: computed('subscription.id', function () {
    const subscriptionId = this.get('subscription.id');
    const type = 1;
    if (subscriptionId) {
      return this.store.query('invoice', { type, subscriptionId });
    } else {
      return [];
    }
  }),
});
