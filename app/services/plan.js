import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { not, filterBy, reads } from '@ember/object/computed';

export default Service.extend({
  store: service(),

  showAnnual: false,
  availablePlans: config.plans,
  showMonthly: not('showAnnual'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  plans: reads('fetchPlans.lastSuccessful.value'),

  fetchPlans: task(function* () {
    return yield this.store.findAll('plan') || [];
  }).keepLatest(),

  availablePlanNames: computed('availablePlans.name', function () {
    return this.availablePlans.mapBy('name').uniq();
  }),

  monthlyPlans: computed('plans.@each.{name,annual,builds}', function () {
    const plans = this.plans || [];
    const filteredMonthlyPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && this.availablePlanNames.includes(name);
    });
    return filteredMonthlyPlans.sort((a, b) => a.builds - b.builds);
  }),

  annualPlans: computed('plans.@each.{name,annual,builds}', function () {
    const plans = this.plans || [];
    const filteredAnnualPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return annual && builds <= 10 && this.availablePlanNames.includes(name);
    });
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
