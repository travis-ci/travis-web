import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';
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
  
  show: computed('subscription', function () {
    console.log("this subecription: " + JSON.stringify(this.subscription))
    ;

    console.log("this subecription.plan.free: " + this.subscription.plan.get('isFree'));
    console.log("is org: " + this.subscription.owner.get('isOrganization'));
    console.log("is adm: " + this.subscription.owner.get('permissions').admin);
    let isOrganization = this.subscription.owner.get('isOrganization');
    let isAdmin = this.subscription.owner.get('permissions').admin;
    if (this.subscription.plan.get('isFree') || (isOrganization && !isAdmin)) return false;
    return true;
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
