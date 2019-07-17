import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { not, filterBy, or, mapBy, equal } from '@ember/object/computed';

const STEPS = {
  ONE: 'stepOne',
  TWO: 'stepTwo'
};

const steps = [...Object.values(STEPS)];

export default Component.extend({
  store: service(),
  flashes: service(),
  accounts: service(),
  plans: null,
  showAnnual: false,
  availablePlans: config.plans,
  steps,

  currentStep: computed('steps.[]', {
    get() {
      return this.steps.get('firstObject');
    },
    set(key, value) {
      return value;
    }
  }),

  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  showMonthly: not('showAnnual'),
  defaultPlan: filterBy('availablePlans', 'isDefault'),
  availablePlanNames: mapBy('availablePlans', 'name'),
  isSavingSubscription: or('saveSubscription.isRunning', 'accounts.fetchSubscriptions.isRunning'),

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
    }
  ),

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
    }
  ),

  reset() {
    this.newSubscription.billingInfo.setProperties({
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      vatId: '',
      billingEmail: '',
    });
  },

  saveSubscription: task(function* () {
    const { fetchSubscriptions } = this.accounts;
    try {
      yield this.newSubscription.save();
      fetchSubscriptions.perform();
    } catch (error) {
      this.reset();
      this.flashes.error('There was an error creating your subscription. Please try again.');
    }
  }).drop(),

  actions: {

    next() {
      const { steps, currentStep } = this;
      const currentIndex = steps.indexOf(currentStep);
      this.set('currentStep', steps[currentIndex + 1]);
      window.scrollTo(0, 269);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
      this.reset();
    },

    handleSubmit(token, lastDigits) {
      const { account } = this;
      const organizationId = account.type === 'organization' ? account.id : null;
      this.newSubscription.setProperties({ organizationId, plan: this.selectedPlan });
      this.newSubscription.creditCardInfo.setProperties({ token, lastDigits });
      this.saveSubscription.perform();
    }
  }
});
