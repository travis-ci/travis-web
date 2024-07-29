import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { filter } from 'lodash';

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
  annualPlans: [],
  areAllAnnualPlans: false,

  displayedPlans: computed('availablePlans.[]', 'subscription.plan.startingPrice', function () {
    if (!this.subscription || !this.subscription.plan || this.subscription.plan.trialPlan) {
      return this.availablePlans;
    }

    let allowedHybridPlans = this.availablePlans.filter(plan => plan.planType.includes('hybrid'));
    let allowedMeteredPlans = this.availablePlans.filter(plan => plan.planType.includes('metered'));

    let filteredPlans = this.filterPlansByStartingPrice(this.availablePlans, this.subscription.plan.startingPrice);

    if (this.isHybridPlan(this.subscription.plan)) {
      return this.handleHybridPlans.call(this, filteredPlans, allowedHybridPlans, allowedMeteredPlans);
    } else if (this.isMeteredPlan(this.subscription.plan)) {
      return this.handleMeteredPlans.call(this, allowedHybridPlans, allowedMeteredPlans);
    } else {
      return this.availablePlans;
    }
  }),

  filterPlansByStartingPrice(plans, startingPrice) {
    return plans.filter(plan => plan.startingPrice > startingPrice);
  },

  isHybridPlan(plan) {
    return plan.planType && plan.planType.includes('hybrid');
  },

  isMeteredPlan(plan) {
    return plan.planType && plan.planType.includes('metered');
  },

  handleHybridPlans(filteredPlans, allowedHybridPlans, allowedMeteredPlans) {
    let filteredHybridPlans = this.filterPlansByStartingPrice(allowedHybridPlans, this.subscription.plan.startingPrice);
    filteredPlans = filteredHybridPlans.filter(plan => !allowedMeteredPlans.includes(plan));

    if (filteredPlans.every(plan => plan.planType === 'hybrid annual')) {
      this.set('annualPlans', filteredPlans);
    }

    if (this.subscription.canceledAt) {
      return this.availablePlans;
    }

    const referencePlan = this.findReferencePlan('hybrid annual');
    if (!referencePlan) {
      return this.availablePlans;
    }

    const higherTierPlans = this.filterHigherTierPlans(referencePlan);
    filteredPlans = filteredPlans.filter(plan => !higherTierPlans.includes(plan));

    return filteredPlans;
  },

  handleMeteredPlans(allowedHybridPlans, allowedMeteredPlans) {
    let filteredMeteredPlans = this.filterPlansByStartingPrice(allowedMeteredPlans, this.subscription.plan.startingPrice);
    let filteredHybridPlans = this.filterPlansByStartingPrice(allowedHybridPlans, this.subscription.plan.startingPrice);

    let filteredPlans = [...filteredMeteredPlans, ...filteredHybridPlans];
    if (filteredPlans.length > 0) {
      this.set('annualPlans', true);
    }

    return filteredPlans;
  },

  findReferencePlan(planType) {
    return this.availablePlans.find(plan =>
      plan.name === this.subscription.plan.name && plan.planType === planType
    );
  },

  filterHigherTierPlans(referencePlan) {
    return this.availablePlans.filter(plan =>
      plan.startingPrice > this.subscription.plan.startingPrice &&
      plan.planType === referencePlan.planType &&
      plan.startingPrice < referencePlan.startingPrice
    );
  },

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
    },
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

  // Determine if the user has either an annual plan or all displayed plans are annual so we can show the annual card immediately in the UI
  didInsertElement() {
    this._super(...arguments);

    this.set('areAllAnnualPlans', Array.isArray(this.annualPlans) && this.annualPlans.length > 0);
    if (this.annualPlans.length === 0) {
      this.set('emptyAnnualPlans', true);
    }

    if (this.subscription && this.subscription.plan && (this.subscription.plan.isAnnual || this.areAllAnnualPlans) && !this.subscription.canceledAt) {
      this.set('showAnnual', true);
    }
  },
});
