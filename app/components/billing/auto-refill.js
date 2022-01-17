import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  flashes: service(),
  accounts: service(),

  account: null,
  subscription: null,
  autoRefillEnabled: reads('subscription.autoRefillEnabled'),
  autoRefillThreshold: reads('subscription.autoRefillThreshold'),
  autoRefillAmount: reads('subscription.autoRefillAmount'),
  autoRefillThresholds: reads('subscription.autoRefillThresholds'),
  autoRefillAmounts: reads('subscription.autoRefillAmounts'),

  creditsTotal: reads('subscription.addonUsage.private.totalCredits'),

  selectedThreshold: computed('autoRefillThreshold', function () {
    return this.autoRefillThreshold;
  }),

  selectedAmount: computed('autoRefillAmount', function () {
    return this.autoRefillAmount;
  }),

  autoRefillCredits: computed('creditsTotal', 'autoRefillAmount', function () {
    return this.autoRefillAmount;
  }),

  autoRefillPrice: computed('autoRefillAmount', function () {
    return Math.ceil(this.autoRefillAmount * 0.0006);
  }),

  autoRefillMinimumCredits: computed('creditsTotal', 'autoRefillThreshold', function () {
    return this.autoRefillThreshold;
  }),

  show: computed('subscription', function () {
    let isOrganization = this.subscription.owner.get('isOrganization');
    let isAdmin = this.subscription.owner.get('permissions').admin;
    return !((this.subscription.plan.id === 'free_tier_plan' || this.subscription.plan.id === 'starter_plan' || this.subscription.get('isManual')) || (isOrganization && !isAdmin));
  }),

  toggleAutoRefill: task(function* (value) {
    try {
      yield this.subscription.autoRefillToggle.perform(this.subscription.owner, value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your Auto Refill settings were not saved.');
    }
  }).restartable(),

  updateAutoRefill: task(function* () {
    try {
      yield this.subscription.autoRefillUpdate.perform(this.selectedThreshold, this.selectedAmount);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your Auto Refill settings were not saved.');
    }
  }).restartable()
});
