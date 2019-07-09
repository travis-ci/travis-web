import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
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

export default Component.extend({
  store: service(),
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
    try {
      yield this.newSubscription.save();
    } catch (error) {
      this.flashes.error('There was an error saving the subscription task. Please try again.');
    }
  }).drop(),

  actions: {

    next(newSubscription) {
      const { steps, currentStep } = this;
      this.set('newSubscription', newSubscription);
      const currentIndex = steps.indexOf(currentStep);
      this.set('currentStep', steps[currentIndex + 1]);
    },

    back() {
      const { steps, currentStep } = this;
      const index = steps.indexOf(currentStep);
      this.set('currentStep', steps.get(index - 1));
    },

    cancel() {
      this.set('currentStep', STEPS.stepOne);
    },

    handleSubmit(token, lastDigits) {
      const { account } = this;
      const organizationId = account.type === 'organization' ? account.id : null;
      this.newSubscription.set('organizationId', organizationId);
      this.newSubscription.set('plan', this.selectedPlan);
      this.newSubscription.creditCardInfo.setProperties({token, lastDigits});
      this.save.perform();
    }
  }
});
