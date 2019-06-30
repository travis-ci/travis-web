import Component from '@ember/component';
import { getCountries } from '../utils/countries';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';

export default Component.extend({
  plans: null,
  selectedPlan: null,
  showAnnual: false,
  countries: getCountries(),
  plansToShow: ['Bootstrap', 'Startup', 'Small Business', 'Premium'],
  defaultPlan: 'Startup',
  showMonthly: not('showAnnual'),

  monthlyPlans: computed('plans', function () {
    const { plans, plansToShow } = this;
    const filteredMonthlyPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && plansToShow.includes(name);
    });
    const sortedMonthlyPlans = filteredMonthlyPlans.sort((a, b) => a.builds - b.builds);
    return sortedMonthlyPlans;
  }),

  yearlyPlans: computed('plans', function () {
    const { plans, plansToShow } = this;
    const filteredYearlyPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return annual && builds <= 10 && plansToShow.includes(name);
    });
    const sortedYearlyPlans = filteredYearlyPlans.sort((a, b) => a.builds - b.builds);
    return sortedYearlyPlans;
  }),

  displayedPlans: computed('showAnnual', 'monthlyPlans', 'yearlyPlans', function () {
    const { yearlyPlans, showAnnual, monthlyPlans, defaultPlan } = this;
    let displayedPlans = monthlyPlans;
    if (showAnnual) {
      const startUpPlan = yearlyPlans.findBy('name', defaultPlan);
      this.set('selectedPlan', startUpPlan);
      displayedPlans = yearlyPlans;
    } else {
      const startUpPlan = monthlyPlans.findBy('name', defaultPlan);
      this.set('selectedPlan', startUpPlan);
    }
    return displayedPlans;
  }),

  actions: {
    selectPlan(planId) {
      const displayedPlans = this.get('displayedPlans');
      const selectedPlan = displayedPlans.findBy('id', planId);
      this.set('selectedPlan', selectedPlan);
    }
  }
});
