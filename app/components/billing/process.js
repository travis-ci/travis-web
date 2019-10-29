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
  plan: service(),
  metrics: service(),
  account: null,

  showAnnual: false,
  defaultPlanName: reads('plan.defaultPlanName'),
  annualPlans: reads('plan.annualPlans'),
  monthlyPlans: reads('plan.monthlyPlans'),

  displayedPlans: computed('showAnnual', 'annualPlans', 'monthlyPlans', function () {
    return this.showAnnual ? this.annualPlans : this.monthlyPlans;
  }),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', function () {
    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  scrollSection: null,
  steps: computed(() => [...Object.values(STEPS)]),

  currentStep: reads('steps.firstObject'),
  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),

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

    back(scrollSection) {
      const currentIndex = this.steps.indexOf(this.currentStep);
      const prevIndex = Math.max(0, currentIndex - 1);
      this.set('currentStep', this.steps[prevIndex]);
      this.set('scrollSection', scrollSection);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
    },
  }
});
