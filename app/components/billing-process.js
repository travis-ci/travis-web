import Component from '@ember/component';
import { computed } from '@ember/object';
import { not, filterBy, mapBy, equal } from '@ember/object/computed';

const STEPS = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo'
};

export default Component.extend({
  plans: null,
  showAnnual: false,
  steps: [...Object.values(STEPS)],
  currentStep: computed('steps.[]', {
    get() {
      return this.steps.get('firstObject');
    },
    set(key, value) {
      return value;
    }
  }),
  isStepOne: equal('currentStep', STEPS.stepOne),
  isStepTwo: equal('currentStep', STEPS.stepTwo),

  billingInfo: {
    firstName: '',
    lastName: '',
    companyName: '',
    billingEmail: '',
    street: '',
    billingSuite: '',
    billingCity: '',
    bllingZip: '',
    country: '',
    vatId: ''
  },

  paymentInfo: {
    cardNumber: null,
    cardName: '',
    expiryDateMonth: '',
    expiryDateYear: '',
    cvc: '',
    discountCode: ''
  },

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

  showMonthly: not('showAnnual'),
  defaultPlan: filterBy('availablePlans', 'isDefault'),
  availablePlanNames: mapBy('availablePlans', 'name'),

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
    'monthlyPlans.@each.{name,annual,builds}',
    'annualPlans.@each.{name,annual,builds}',
    function () {
      const { annualPlans, showAnnual, monthlyPlans } = this;
      return showAnnual ? annualPlans : monthlyPlans;
    }),

  selectedPlan: computed('displayedPlans', 'defaultPlan', function () {
    const { displayedPlans, defaultPlan } = this;
    const plan = defaultPlan.get('firstObject');
    return displayedPlans.findBy('name', plan.name);
  }),

  actions: {

    next() {
      const { steps, currentStep } = this;
      const index = steps.indexOf(currentStep);
      this.set('currentStep', steps[index + 1]);
    },

    back() {
      const { steps, currentStep } = this;
      const index = steps.indexOf(currentStep);
      this.set('currentStep', steps.get(index - 1));
    }
  }
});
