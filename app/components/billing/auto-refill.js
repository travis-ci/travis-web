import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

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

  selectedThreshold: computed('autoRefillThreshold', {
    get() {
      if (isPresent(this._selectedThreshold)) {
        return this._selectedThreshold;
      }
      return this.autoRefillThreshold;
    },
    set(k, v) {
      this.set('_selectedThreshold', v);
      this.set('autoRefillThreshold', v);
    }
  }),

  selectedAmount: computed('autoRefillAmount', {
    get() {
      if (isPresent(this._selectedAmount)) {
        return this._selectedAmount;
      }
      return this.autoRefillAmount;
    },
    set(k, v) {
      this.set('_selectedAmount', v);
      this.set('autoRefillAmount', v);
    }
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
    let permissions = this.subscription && this.subscription.owner ? this.subscription.owner.get('permissions') : null;
    let isAdmin = permissions && permissions.admin;

    let currentAccountId = this.account.id;
    let planShares = this.subscription.planShares || [];
    let isReceiver = planShares.some(share => {
      let receiverId = Array.isArray(share.receiver?.id) ? share.receiver.id : [share.receiver?.id];
      return receiverId.map(String).includes(String(currentAccountId));
    });

    return !(this.subscription.plan.get('id') === 'free_tier_plan' ||
    this.subscription.plan.get('id') === 'starter_plan' ||
    this.subscription.get('isManual') ||
    isReceiver ||
    (isOrganization && !isAdmin));
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
      yield this.subscription.autoRefillUpdate.perform(this.autoRefillThreshold, this.autoRefillAmount);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your Auto Refill settings were not saved.');
    }
  }).restartable()
});
