import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),

  selectableAccounts: reads('accounts.all'),
  selectedAccounts: computed(() => []),

  cantSubmit: empty('selectedAccounts'),

  onClose() {},

  actions: {

    onClose() {
      this.onClose();
    },

    register() {
      this.onClose();
    }

  }

});
