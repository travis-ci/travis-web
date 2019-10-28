import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { or } from '@ember/object/computed';

export default Component.extend({

  plan: service(),
  accounts: service(),

  account: null,
  showPlansSelector: true,
  showCancelButton: false,
  title: null,
  selectedPlan: null,
  isLoading: or('save.isRunning', 'accounts.fetchSubscriptions.isRunning'),

  save: task(function* () {
    if (this.submit.perform) {
      yield this.submit.perform();
    } else {
      this.newSubscription.set('plan', this.selectedPlan);
      this.submit();
    }
    this.set('showPlansSelector', false);
  }).drop(),

  actions: {
    togglePlanPeriod() {
      this.plan.togglePlanPeriod();
    },
  }
});
