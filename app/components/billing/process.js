import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';
import { computed } from '@ember/object';

const STEPS = {
  ONE: 'stepOne',
  TWO: 'stepTwo',
  THREE: 'stepThree'
};

export default Component.extend({
  metrics: service(),
  account: null,
  steps: computed(() => [...Object.values(STEPS)]),

  currentStep: reads('steps.firstObject'),
  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),
  selectedPlan: reads('newSubscription.plan'),

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
        this.set('currentStep', this.steps[nextIndex]);
      }
    },

    back() {
      const currentIndex = this.steps.indexOf(this.currentStep);
      const prevIndex = Math.max(0, currentIndex - 1);
      this.set('currentStep', this.steps[prevIndex]);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
    },
  }
});
