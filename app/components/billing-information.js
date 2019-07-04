import Component from '@ember/component';
// import config from 'travis/config/environment';
import { getCountries } from '../utils/countries';
import { computed } from '@ember/object';
import { not, filterBy, mapBy } from '@ember/object/computed';


export default Component.extend({
  plans: null,
  showAnnual: false,
  availablePlans: [
    {
      name: 'Bootstrap',
      enabled: true
    },
    {
      name: 'Startup',
      enabled: true,
      isDefault: true
    },
    {
      name: 'Small Business',
      enabled: true
    },
    {
      name: 'Premium',
      enabled: true
    }
  ],
  countries: getCountries,

  showMonthly: not('showAnnual'),
  defaultPlan: filterBy('availablePlans', 'isDefault'),
  availablePlanNames: mapBy('availablePlans', 'name'),

  monthlyPlans: computed('plans', function () {
    const { plans, availablePlanNames } = this;
    const filteredMonthlyPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && availablePlanNames.includes(name);
    });
    const sortedMonthlyPlans = filteredMonthlyPlans.sort((a, b) => a.builds - b.builds);
    return sortedMonthlyPlans;
  }),

  annualPlans: computed('plans', function () {
    const { plans, availablePlanNames } = this;
    const filteredAnnualPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return annual && builds <= 10 && availablePlanNames.includes(name);
    });
    const sortedAnnualPlans = filteredAnnualPlans.sort((a, b) => a.builds - b.builds);
    return sortedAnnualPlans;
  }),

  displayedPlans: computed('showAnnual', 'monthlyPlans', 'annualPlans', function () {
    const { annualPlans, showAnnual, monthlyPlans } = this;
    return showAnnual ? annualPlans : monthlyPlans;
  }),

  selectedPlan: computed('displayedPlans', function () {
    const { displayedPlans, defaultPlan } = this;
    const plan = defaultPlan.get('firstObject');
    return displayedPlans.findBy('name', plan.name);
  }),
});
