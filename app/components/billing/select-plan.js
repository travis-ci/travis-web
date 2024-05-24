import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  title: null,
  availablePlans: reads('account.eligibleV2Plans'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning'),
  showAnnual: false,
  showCalculator: false,

  displayedPlans: computed('availablePlans.[]', 'subscription.plan.startingPrice', function () {
    if (this.subscription && this.subscription.plan && !this.subscription.plan.trialPlan) {
      const referencePlan = this.availablePlans
        .find(plan => plan.name === this.subscription.plan.name && plan.planType === 'hybrid annual');

      if (!referencePlan) {
        return this.availablePlans;
      }

      const higherTierPlans = this.availablePlans
        .filter(plan => plan.startingPrice > this.subscription.plan.startingPrice)
        .filter(plan => plan.planType === referencePlan.planType && plan.startingPrice < referencePlan.startingPrice);

      let filteredPlans = this.availablePlans
        .filter(plan => plan.startingPrice > this.subscription.plan.startingPrice);

      filteredPlans = filteredPlans.filter(plan => !higherTierPlans.includes(plan));

      return filteredPlans;
    } else {
      return this.availablePlans;
    }
  }),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', {
    get() {
      if (isPresent(this._selectedPlan)) {
        return this._selectedPlan;
      }
      let result = this.displayedPlans.findBy('name', this.defaultPlanName);
      return result;
    },
    set(key, value) {
      this.set('_selectedPlan', value);
      return this._selectedPlan;
    }
  }),

  allowReactivation: computed(function () {
    if (this.subscription) {
      return (this.subscription.isCanceled || this.subscription.isExpired) && !this.subscription.scheduledPlan;
    } else {
      return false;
    }
  }),
  hasPlanChangePermission: computed('account', function () {
    return !this.account.isOrganization || this.account.permissions.plan_create;
  }),

  save: task(function* () {
    if (this.next.perform) {
      yield this.next.perform();
    } else {
      this.next();
    }
  }).drop(),

  reactivatePlan(plan, form) {
    this.set('selectedPlan', plan);
    this.set('isReactivation', true);
    later(form.submit, 500);
  },

  selectAndSubmit(plan, form) {
    this.set('selectedPlan', plan);
    later(form.submit, 500);
  },

  submitForm(form) {
    later(form.submit, 500);
  },

  actions: {
    selectAndSubmit(plan, form) {
      this.selectAndSubmit(plan, form);
    },

    reactivatePlan(plan, form) {
      this.reactivatePlan(plan, form);
    },

    showAnnualPlans() {
      this.set('showAnnual', true);
    },

    showMonthlyPlans() {
      this.set('showAnnual', false);
    },

    showCalculator() {
      this.set('showCalculator', true);
    },

    hideCalculator() {
      this.set('showCalculator', false);
    },
  },

  // This hook is needed to determine if the user has an annual plan or monthly Premium so we can show the annual plans immediately in the UI
  didInsertElement() {
    this._super(...arguments);
    if (this.subscription && this.subscription.plan && (this.subscription.plan.isAnnual || this.subscription.plan.name === 'Premium')) {
      this.set('showAnnual', true);
    }
  },
});
