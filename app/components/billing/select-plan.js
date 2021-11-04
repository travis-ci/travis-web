import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  title: null,
  availablePlans: reads('account.eligibleV2Plans'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning'),
  showAnnual: true,
  showCalculator: false,

  displayedPlans: reads('availablePlans'),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', function () {
    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  allowReactivation: computed(function () {
    if (this.subscription) {
      return this.subscription.isCanceled && !this.subscription.scheduledPlan;
    } else {
      return false;
    }
  }),

  save: task(function* () {
    if (this.next.perform) {
      yield this.next.perform();
    } else {
      this.next();
    }
  }).drop(),

  reactivatePlan(plan, form) {
    this.set('selectedPlan', plan);
    this.set('isReactivation', true);
    later(form.submit, 500);
  },

  selectAndSubmit(plan, form) {
    this.set('selectedPlan', plan);
    later(form.submit, 500);
  },

  submitForm(form) {
    later(form.submit, 500);
  },

  actions: {
    selectAndSubmit(plan, form) {
      this.selectAndSubmit(plan, form);
    },

    reactivatePlan(plan, form) {
      this.reactivatePlan(plan, form);
    },

    showAnnualPlans() {
      this.set('showAnnual', true);
    },

    showMonthlyPlans() {
      this.set('showAnnual', false);
    },

    showCalculator() {
      this.set('showCalculator', true);
    },

    hideCalculator() {
      this.set('showCalculator', false);
    }
  }
});
