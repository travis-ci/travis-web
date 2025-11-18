import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { A } from '@ember/array';
import isCurrentTrial from 'travis/utils/computed-is-current-trial';

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
  isCurrentTrial: isCurrentTrial(),

  isCancellationMoreThanOneMonthOld: computed('subscription.{isCanceled,canceledAt}', function () {
    if (!this.subscription || !this.subscription.isCanceled) {
      return false;
    }

    const canceledAtTime = new Date(this.subscription.canceledAt).getTime();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);

    const oneMonthAgoTime = currentDate.getTime();

    return canceledAtTime < oneMonthAgoTime;
  }),

  isValidityMoreThanOneMonthOld: computed('subscription.validTo', function () {
    if (!this.subscription || !this.subscription.validTo) {
      return false;
    }

    const validToTime = new Date(this.subscription.validTo).getTime();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);

    const oneMonthAgoTime = currentDate.getTime();

    return validToTime < oneMonthAgoTime;
  }),

  displayedPlans: computed('availablePlans.[]', 'subscription.plan.startingPrice', function () {
    if (this.isCurrentTrial && !this.availablePlans.includes(this.subscription.plan)) {
      this.availablePlans = [this.subscription.plan, ...this.availablePlans];
    }

    if (!this.subscription || !this.subscription.plan || this.subscription.plan.trialPlan) {
      return this.sortedPlans;
    }

    if (this.isCancellationMoreThanOneMonthOld || this.isValidityMoreThanOneMonthOld) {
      return this.sortedPlans;
    }

    let allowedHybridPlans = this.availablePlans.filter(plan => plan.planType.includes('hybrid'));
    let allowedMeteredPlans = this.availablePlans.filter(plan => plan.planType.includes('metered'));

    let filteredPlans = this.filterPlansByStartingPrice(this.availablePlans, this.subscription.plan.startingPrice);

    if (this.isHybridPlan(this.subscription.plan)) {
      return this.handleHybridPlans.call(this, filteredPlans, allowedHybridPlans, allowedMeteredPlans);
    } else if (this.isMeteredPlan(this.subscription.plan)) {
      return this.handleMeteredPlans.call(this, allowedHybridPlans, allowedMeteredPlans);
    } else {
      // set the annualPlans property for old subscriptions
      if (this.availablePlans.every(plan => plan.isAnnual)) {
        this.set('annualPlans', this.availablePlans);
      }
      return this.sortedPlans;
    }
  }),

  filterPlansByStartingPrice(plans, startingPrice) {
    return plans.filter(plan => (
      this.isCurrentTrial
        ? plan.startingPrice >= startingPrice
        : plan.startingPrice > startingPrice
    ));
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

    if (filteredPlans.every(plan => plan.isAnnual)) {
      this.set('annualPlans', filteredPlans);
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

  sortedPlans: computed('availablePlans.@each.startingPrice', function () {
    return this.sortByStartingPrice(this.availablePlans);
  }),

  sortByStartingPrice(plans) {
    return A(plans).sortBy('startingPrice');
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

  allowedTrial: computed('availablePlans', 'subscription.{isActive,plan}', function () {
    const sub = this.subscription;
    console.log('1. Full Subscription Object:', sub);
    // --- DEBUG START ---
    console.log('%c allowedTrial Triggered', 'color: orange; font-weight: bold;');
    console.log('1. Subscription exists?', !!this.subscription);
    console.log('2. Plan exists?', this.subscription ? !!this.subscription.plan : 'No subscription');
    console.log('3. Is Active?', this.subscription ? this.subscription.isActive : 'N/A');
    console.log('4. Account Trial Allowed?', this.account.trialAllowed);
    // --- DEBUG END ---

    if (this.subscription && this.subscription.plan) {
      return false;
    }

    if (this.subscription && (this.subscription.isActive || this.isCurrentTrial)) {
      return false;
    }

    return this.account.trialAllowed;
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

  // Determine if the user has either an annual plan or all to be displayed plans are annual so we can show the annual card immediately in the UI
  didInsertElement() {
    this._super(...arguments);

    this.set('areAllAnnualPlans', Array.isArray(this.annualPlans) && this.annualPlans.length > 0);

    if (this.annualPlans.length === 0) {
      this.set('emptyAnnualPlans', true);
    }

    if (this.subscription && this.subscription.plan) {
      if (!this.subscription.isCanceled && !this.isValidityMoreThanOneMonthOld) {
        if (this.subscription.plan.isAnnual || this.areAllAnnualPlans) {
          this.set('showAnnual', true);
        }
      } else if (this.subscription.isCanceled && !this.isCancellationMoreThanOneMonthOld) {
        if (this.subscription.plan.isAnnual || this.areAllAnnualPlans) {
          this.set('showAnnual', true);
        }
      }
    }
  },
});
