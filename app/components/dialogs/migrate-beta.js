import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),

  selectableAccounts: reads('accounts.all'),
  selectedAccounts: computed(() => []),

  onClose() {},

  actions: {

    onClose() {
      this.onClose();
    },

    toggleAccount(account) {
      const { selectedAccounts } = this;
      if (selectedAccounts.includes(account)) {
        selectedAccounts.removeObject(account);
      } else {
        selectedAccounts.addObject(account);
      }
    }

  }

});
