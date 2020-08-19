import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { or, reads, filterBy } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  showPlansSelector: true,
  showCancelButton: false,
  title: null,
  availablePlans: reads('account.eligibleV2Plans'),
  defaultPlans: filterBy('availablePlans', 'isDefault'),
  defaultPlanName: reads('defaultPlans.firstObject.name'),
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning'),

  displayedPlans: computed('availablePlans.[]', function () {
    this.availablePlans.forEach((plan) => {
      plan.price = plan.default_addons.reduce((a, b) => a + b.price, 0);
      const credits = plan.default_addons.filter((addon) => addon.type === 'credit_private').reduce((a, b) => a + b.quantity, 0);
      plan.credits = credits.toLocaleString();
      const users = plan.default_addons.filter((addon) => addon.type === 'user_license').reduce((a, b) => a + b.quantity, 0);
      plan.users = users.toLocaleString();
    });
    return this.availablePlans;
  }),

  selectedPlan: computed('displayedPlans.[].name', 'defaultPlanName', function () {
    return this.displayedPlans.findBy('name', this.defaultPlanName);
  }),

  save: task(function* () {
    if (this.submit.perform) {
      yield this.submit.perform();
    } else {
      const { store } = this;
      const selectedPlan = store.peekRecord('plan', this.selectedPlan.id) || store.createRecord('plan', { ...this.selectedPlan });
      this.newSubscription.set('plan', selectedPlan);
      this.submit();
    }
    this.set('showPlansSelector', false);
  }).drop(),

  actions: {
    togglePlanPeriod() {
      this.toggleProperty('showAnnual');
    },
  }
});
