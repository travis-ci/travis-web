import Component from '@ember/component';
import { getCountries } from '../utils/countries';
import { computed } from '@ember/object';

export default Component.extend({
  plans: null,
  selectedPlan: null,
  monthlyPlans: null,
  yearlyPlans: null,
  showAnnual: false,
  countries: getCountries(),
  plansToShow: ['Bootstrap', 'Startup', 'Premium', 'Small Business'],
  defaultPlan: 'Startup',

  monthlyPlans: computed('plans', function () {
    const monthlyPlans = this.plans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && this.plansToShow.includes(name);
    });
    return monthlyPlans;
  }),

  yearlyPlans: computed('plans', function () {
    const yearlyPlans = this.plans.filter(plan => {
      const { annual, builds, name } = plan;
      return annual && builds <= 10 && this.plansToShow.includes(name);
    });
    return yearlyPlans;
  }),

  displayedPlans: computed('showAnnual', 'monthlyPlans', 'yearlyPlans', function () {
    let displayedPlans = this.monthlyPlans;
    if (this.showAnnual) {
      const startUpPlan = this.yearlyPlans.findBy('name', this.defaultPlan);
      this.set('selectedPlan', startUpPlan);
      displayedPlans = this.yearlyPlans;
    } else {
      const startUpPlan = this.monthlyPlans.findBy('name', this.defaultPlan);
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
