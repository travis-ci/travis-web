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

  creditsTotal: reads('subscription.addonUsage.private.totalCredits'),

  autoRefillCredits: computed('creditsTotal', 'autoRefillAmount', function () {
    return this.autoRefillAmount;
  }),

  autoRefillMinimumCredits: computed('creditsTotal', 'autoRefillThreshold', function () {
    return this.autoRefillThreshold;
  }),

  toggleAutoRefill: task(function* (value) {
    try {
      yield this.subscription.autoRefillToggle.perform(this.subscription.owner, value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your Auto Refill settings were not saved.');
    }
  }).restartable(),
});
