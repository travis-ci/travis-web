import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { not, reads } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),
  store: service(),

  account: null,
  title: null,
  selectedAddon: null,
  availableStandaloneAddons: computed('account.availableStandaloneAddons.[].price', function () {
    return this.account.availableStandaloneAddons.sortBy('price');
  }),
  isButtonDisabled: not('selectedAddon'),
  displayedStandaloneAddons: reads('availableStandaloneAddons'),
  totalPrice: computed('selectedAddon.price', function () {
    return this.selectedAddon ? this.selectedAddon.price : 0;
  }),

  save: task(function* () {
    if (this.next.perform) {
      yield this.next.perform();
    } else {
      this.next();
    }
  }).drop(),

  actions: {
    selectAndSubmit(form) {
      this.set('selectedAddon', this.selectedAddon);
      later(() => form.submit(), 500);
    },
    cancel() {
      this.set('selectedAddon', null);
      this.set('showAddonsSelector', false);
    }
  }
});
