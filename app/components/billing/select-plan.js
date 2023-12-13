import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';
import { A } from '@ember/array';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  title: null,
  availablePlans: reads('account.eligibleV2Plans'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning'),
  showAnnual: false,
  showCalculator: false,

  displayedPlans: reads('availablePlans'),

  selectedPlanOverride: null,
  selectedPlan: computed('selectedPlanOverride', 'displayedPlans.[].name', 'defaultPlanName', function () {
    if (this.selectedPlanOverride !== null)
      return this.selectedPlanOverride;

    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  allowReactivation: computed(function () {
    if (this.subscription) {
      return (this.subscription.isCanceled || this.subscription.isExpired) && !this.subscription.scheduledPlan;
    } else {
      return false;
    }
  }),
  hasPlanChangePermission: computed('account', function () {
    return !this.account.isOrganization || this.account.permissions.plan_create;
  }),

  save: task(function* () {
    if (this.next.perform) {
      yield this.next.perform();
    } else {
      this.next();
    }
  }).drop(),

  reactivatePlan(plan, form) {
    this.set('selectedPlanOverride', plan);
    this.set('isReactivation', true);
    later(form.submit, 500);
  },

  selectAndSubmit(plan, form) {
    this.set('selectedPlanOverride', plan);
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
    },
  }
});
