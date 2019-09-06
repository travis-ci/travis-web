import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, not, and } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  plan: service(),

  subscription: null,
  account: null,
  showPlansSelector: false,
  showCancelModal: false,

  showMonthly: reads('plan.showMonthly'),
  displayedPlans: reads('plan.displayedPlans'),
  selectedPlan: reads('plan.selectedPlan'),
  showAnnual: reads('plan.showAnnual'),
  isEditPlanLoading: reads('subscription.changePlan.isLoading'),

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
  canChangePlan: reads('account.hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'account.hasSubscriptionPermissions'),

  editPlan: task(function* () {
    yield this.subscription.changePlan.perform(this.selectedPlan.id);
  }).drop()

});
