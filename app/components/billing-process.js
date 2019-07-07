import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { not, filterBy, mapBy, equal } from '@ember/object/computed';

const STEPS = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo'
};

let availablePlans = [
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
];

let defaultFormValues = {
  billingInfo: {
    firstName: '',
    lastName: '',
    company: '',
    billingEmail: '',
    street: '',
    billingSuite: '',
    billingCity: '',
    zipCode: '',
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
  }
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

  availablePlans,

  showMonthly: not('showAnnual'),
  defaultPlan: filterBy('availablePlans', 'isDefault'),
  availablePlanNames: mapBy('availablePlans', 'name'),

  init() {
    this.reset();
    this._super(...arguments);
  },

  reset() {
    const { billingInfo, paymentInfo } = defaultFormValues;
    this.setProperties({
      billingInfo,
      paymentInfo
    });
  },

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

  selectedPlan: computed(
    'displayedPlans.@each.{name,price,annual,builds}',
    'defaultPlan', {
      get() {
        const { displayedPlans, defaultPlan } = this;
        const plan = defaultPlan.get('firstObject');
        return displayedPlans.findBy('name', plan.name);
      },
      set(key, value) {
        return value;
      }
    }),

  save: task(function* () {
    const subscription = this.store.createRecord('subscription', {
      plan: this.selectedPlan.id,
      organizationId: this.account.type === 'organization' && this.account.id,
      billingInfo: {
        firstName: this.billingInfo.firstName,
        lastName: this.billingInfo.lastName,
        company: this.billingInfo.company,
        address: this.billingInfo.street,
        address2: this.billingInfo.suite,
        city: this.billingInfo.billingCity,
        country: this.billingInfo.country,
        zipCode: this.billingInfo.zipCode,
        vatId: this.billingInfo.vatId,
        billingEmail: this.billingInfo.billingEmail,
        // creditCardInfo {
        //   // token: set token after connecting to Stripe.
        // }
      }
    });
    try {
      yield subscription.save();
      this.reset();
    } catch (error) {
      subscription.unloadRecord();
      this.flashes.error('There was an error saving the subscription task. Please try again.');
    }
  }).drop(),

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
    },

    cancel() {
      this.reset();
      this.set('currentStep', STEPS.stepOne);
    },

    handleSubmit() {
      this.save.perform();
    }
  }
});
