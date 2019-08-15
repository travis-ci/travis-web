import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { not, filterBy, equal, reads } from '@ember/object/computed';

const STEPS = {
  ONE: 'stepOne',
  TWO: 'stepTwo',
  THREE: 'stepThree'
};

export default Component.extend({
  store: service(),
  accounts: service(),
  plans: null,
  scrollSection: null,
  showAnnual: false,
  availablePlans: config.plans,
  steps: [...Object.values(STEPS)],

  currentStep: reads('steps.firstObject'),

  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),
  showMonthly: not('showAnnual'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),

  availablePlanNames: computed('availablePlans.name', function () {
    return this.availablePlans.mapBy('name').uniq();
  }),

  monthlyPlans: computed('plans.@each.{name,annual,builds}', function () {
    const { plans, availablePlanNames } = this;
    const filteredMonthlyPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && availablePlanNames.includes(name);
    });
    const sortedMonthlyPlans = filteredMonthlyPlans.sort((a, b) => a.builds - b.builds);
    return sortedMonthlyPlans;
  }),

  annualPlans: computed('plans.@each.{name,annual,builds}', function () {
    const { plans, availablePlanNames } = this;
    const filteredAnnualPlans = plans.filter(plan => {
      const { annual, builds, name } = plan;
      return annual && builds <= 10 && availablePlanNames.includes(name);
    });
    const sortedAnnualPlans = filteredAnnualPlans.sort((a, b) => a.builds - b.builds);
    return sortedAnnualPlans;
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

  actions: {

    goToFirstStep() {
      this.set('currentStep', this.steps[0]);
    },

    next() {
      if (this.selectedPlan) {
        const currentIndex = this.steps.indexOf(this.currentStep);
        const lastIndex = this.steps.length - 1;
        const nextIndex = Math.min(lastIndex, currentIndex + 1);
        this.set('currentStep', this.steps[nextIndex]);
      }
    },

    back(scrollSection) {
      const currentIndex = this.steps.indexOf(this.currentStep);
      const prevIndex = Math.max(0, currentIndex - 1);
      this.set('currentStep', this.steps[prevIndex]);
      this.set('scrollSection', scrollSection);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
      this.reset();
    },
  }
});
