import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { or, not, reads } from '@ember/object/computed';

export default Component.extend({
  plan: service(),
  accounts: service(),

  account: null,
  showPlansSelector: true,
  showCancelButton: false,
  title: null,
  showAnnual: false,
  showMonthly: not('showAnnual'),
  monthlyPlans: reads('plan.monthlyPlans'),
  annualPlans: reads('plan.annualPlans'),
  defaultPlanName: reads('plan.defaultPlanName'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning'),

  displayedPlans: computed('showAnnual', 'annualPlans', 'monthlyPlans', function () {
    return this.showAnnual ? this.annualPlans : this.monthlyPlans;
  }),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', function () {
    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  save: task(function* () {
    if (this.submit.perform) {
      yield this.submit.perform();
    } else {
      this.newSubscription.set('plan', this.selectedPlan);
      this.submit();
    }
    this.set('showPlansSelector', false);
  }).drop(),

  actions: {
    togglePlanPeriod() {
      this.toggleProperty('showAnnual');
    },
  }
});
