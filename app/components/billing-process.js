import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';

const STEPS = {
  ONE: 'stepOne',
  TWO: 'stepTwo',
  THREE: 'stepThree'
};

export default Component.extend({
  plan: service(),

  showMonthly: reads('plan.showMonthly'),
  displayedPlans: reads('plan.displayedPlans'),
  selectedPlan: reads('plan.selectedPlan'),
  showAnnual: reads('plan.showAnnual'),

  scrollSection: null,
  steps: [...Object.values(STEPS)],

  currentStep: reads('steps.firstObject'),
  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),

  actions: {

    goToFirstStep() {
      this.set('currentStep', STEPS.ONE);
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
    },
  }
});
