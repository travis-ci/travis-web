import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

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

  showCancelButton: false,

  currentStep: computed({
    get() {
      if (isPresent(this._currentStep)) {
        return this._currentStep;
      }
      return this.storage.billingStep || STEPS.ONE;
    },
    set(key, value) {
      this.set('_currentStep', value);
      return this._currentStep;
    }
  }),

  billingInfoExists: computed('existingBillingInfo.{firstName,lastName,billingEmail,city,zipCode,country}', function () {
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
    this.storage.billingPlan = this.selectedPlan.getProperties(['id', 'name', 'startingPrice', 'startingUsers', 'privateCredits',
      'publicCredits', 'concurrencyLimit', 'planType', 'availableStandaloneAddons', 'addonConfigs']);
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
      console.log("NEXT1");
      console.log(this.selectedPlan);
      console.log(this.selectedAddon);
      if (this.selectedPlan || this.selectedAddon) {
      console.log("NEXT2");
 //       this.trackButtonClicks();
        const currentIndex = this.steps.indexOf(this.currentStep);
        const lastIndex = this.steps.length - 1;

      console.log("NEXT2.1");
        const nextIndex = Math.min(lastIndex, currentIndex + 1);

      console.log("NEXT3");
        if ((this.billingInfoExists && this.currentStep === STEPS.ONE) || this.selectedPlan.startingPrice === 0) {

      console.log("NEXT3.1");
          const currentStep = STEPS.THREE;
          this.set('currentStep', currentStep);
          this.set('billingInfo', this.existingBillingInfo);
        } else {

      console.log("NEXT3.2");
          const currentStep = this.steps[nextIndex];
          this.set('currentStep', currentStep);
        }

      console.log("NEXT4");
        this.updateBillingQueryParams(this.currentStep);

      console.log("NEXT5");
        this.persistBillingData(this.currentStep);

      console.log("NEXT6");
      }

      console.log("NEXT7");
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

    closePlansModal() {
      console.log("CLOSE PLANS MODAL");
      this.set('showPlansSelector', false);
    }
  }
});
