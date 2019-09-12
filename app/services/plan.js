import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { not, filterBy, reads } from '@ember/object/computed';

export default Service.extend({
  accounts: service(),
  store: service(),

  showAnnual: false,
  availablePlans: config.plans,
  showMonthly: not('showAnnual'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  account: reads('accounts.user'),
  plans: reads('fetchPlans.lastSuccessful.value'),

  fetchPlans: task(function* () {
    return yield this.store.findAll('plan') || [];
  }).keepLatest(),

  monthlyPlans: computed('plans.@each.{name,annual,builds}', function () {
    const plans = this.plans || [];
    const filteredMonthlyPlans = plans.filter(plan => !plan.annual && plan.builds);
    return filteredMonthlyPlans.sort((a, b) => a.builds - b.builds);
  }),

  annualPlans: computed('plans.@each.{name,annual,builds}', function () {
    const plans = this.plans || [];
    const filteredAnnualPlans = plans.filter(plan => plan.annual && plan.builds);
    return filteredAnnualPlans.sort((a, b) => a.builds - b.builds);
  }),

  displayedPlans: computed(
    'showAnnual',
    'monthlyPlans.@each.annual',
    'annualPlans.@each.annual',
    function () {
      const { annualPlans, showAnnual, monthlyPlans } = this;
      return showAnnual ? annualPlans : monthlyPlans;
    }
  ),

  selectedPlan: computed(
    'displayedPlans.@each.{name,price,annual,builds}',
    'defaultPlanName', {
      get() {
        return this.displayedPlans.findBy('name', this.defaultPlanName);
      },
      set(key, value) {
        return value;
      }
    }
  ),

  togglePlanPeriod() {
    this.toggleProperty('showAnnual');
  },

  init() {
    this._super(...arguments);
    this.fetchPlans.perform();
  },
});
