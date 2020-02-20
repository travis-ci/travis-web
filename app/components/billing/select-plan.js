import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { or, not, reads, filterBy } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  showPlansSelector: true,
  showCancelButton: false,
  title: null,
  showAnnual: false,
  showMonthly: not('showAnnual'),
  isPlansLoading: reads('account.isFetchPlansRunning'),
  monthlyPlans: reads('account.monthlyPlans'),
  annualPlans: reads('account.annualPlans'),
  availablePlans: computed(() => config.plans),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning'),

  displayedPlans: computed('showAnnual', 'annualPlans.[]', 'monthlyPlans.[]', function () {
    return this.showAnnual ? this.annualPlans : this.monthlyPlans;
  }),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', function () {
    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  save: task(function* () {
    if (this.submit.perform) {
      yield this.submit.perform();
    } else {
      const selectedPlan = this.store.createRecord('plan', { ...this.selectedPlan });
      this.newSubscription.set('plan', selectedPlan);
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
