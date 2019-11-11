import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';
import { computed } from '@ember/object';

const STEPS = {
  ONE: 1,
  TWO: 2,
  THREE: 3
};

export default Component.extend({
  metrics: service(),
  storage: service(),

  account: null,
  steps: computed(() => [...Object.values(STEPS)]),

  currentStep: computed(function () {
    return this.storage.billingStep || STEPS.ONE;
  }),

  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),
  selectedPlan: reads('newSubscription.plan'),
  billingInfo: reads('newSubscription.billingInfo'),

  trackButtonClicks() {
    if (this.currentStep === STEPS.ONE) {
      this.metrics.trackEvent({
        category: 'Subscription',
        action: 'Plan Chosen',
      });
    } else if (this.currentStep === STEPS.TWO) {
      this.metrics.trackEvent({
        category: 'Subscription',
        action: 'Contact Details Filled',
      });
    }
  },

  persistBillingData(step) {
    this.storage.billingStep = step;
    if (this.isStepTwo) {
      const plan = this.selectedPlan.getProperties(['name', 'builds', 'price', 'annual']);
      this.storage.billingPlan = plan;
    } else if (this.isStepThree) {
      this.storage.billingInfo = this.billingInfo;
    }
  },

  actions: {

    goToFirstStep() {
      this.set('currentStep', STEPS.ONE);
    },

    next() {
      if (this.selectedPlan) {
        this.trackButtonClicks();
        const currentIndex = this.steps.indexOf(this.currentStep);
        const lastIndex = this.steps.length - 1;
        const nextIndex = Math.min(lastIndex, currentIndex + 1);
        const currentStep = this.steps[nextIndex];
        this.set('currentStep', currentStep);
        this.persistBillingData(currentStep);
      }
    },

    back() {
      const currentIndex = this.steps.indexOf(this.currentStep);
      const prevIndex = Math.max(0, currentIndex - 1);
      const currentStep = this.steps[prevIndex];
      this.set('currentStep', currentStep);
      this.persistBillingData(currentStep);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
    },
  }
});
