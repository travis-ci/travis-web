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
  router: service(),

  account: null,
  steps: computed(() => [...Object.values(STEPS)]),

  currentStep: computed(function () {
    return this.storage.billingStep || STEPS.ONE;
  }),

  billingInfoExists: computed(function () {
    const billingInfo = this.existingBillingInfo;
    if (billingInfo)
      return billingInfo.firstName && billingInfo.lastName && billingInfo.billingEmail && billingInfo.address
                                   && billingInfo.city && billingInfo.zipCode && billingInfo.country;
    return false;
  }),

  isStepOne: equal('currentStep', STEPS.ONE),
  isStepTwo: equal('currentStep', STEPS.TWO),
  isStepThree: equal('currentStep', STEPS.THREE),
  existingBillingInfo: reads('subscription.billingInfo'),
  existingCreditCardInfo: reads('subscription.creditCardInfo'),

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
    this.storage.billingPlan = this.selectedPlan;
    this.storage.billingInfo = this.billingInfo;
  },

  updateBillingQueryParams(step) {
    this.router.transitionTo({ queryParams: { billingStep: step }});
  },

  actions: {

    goToFirstStep() {
      this.set('currentStep', STEPS.ONE);
      this.persistBillingData(STEPS.ONE);
      this.updateBillingQueryParams(STEPS.ONE);
    },

    next() {
      if (this.selectedPlan) {
        this.trackButtonClicks();
        const currentIndex = this.steps.indexOf(this.currentStep);
        const lastIndex = this.steps.length - 1;
        const nextIndex = Math.min(lastIndex, currentIndex + 1);
        if ((this.billingInfoExists && this.currentStep === STEPS.ONE) || this.selectedPlan.starting_price === 0) {
          const currentStep = STEPS.THREE;
          this.set('currentStep', currentStep);
          this.set('billingInfo', this.existingBillingInfo);
        } else {
          const currentStep = this.steps[nextIndex];
          this.set('currentStep', currentStep);
        }
        this.updateBillingQueryParams(this.currentStep);
        this.persistBillingData(this.currentStep);
      }
    },

    back() {
      const currentIndex = this.steps.indexOf(this.currentStep);
      const prevIndex = Math.max(0, currentIndex - 1);
      const currentStep = this.steps[prevIndex];
      this.set('currentStep', currentStep);
      this.updateBillingQueryParams(currentStep);
      this.persistBillingData(currentStep);
    },

    cancel() {
      this.set('currentStep', STEPS.ONE);
      this.updateBillingQueryParams(STEPS.ONE);
    },
  }
});
