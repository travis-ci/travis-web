import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  accounts: service(),
  flashes: service(),

  user: reads('accounts.user'),
  selectableAccounts: reads('accounts.organizations'),
  selectedAccounts: computed(() => []),

  onClose() {},

  register: task(function* () {
    try {
      yield this.user.joinMigrateBeta(this.selectedAccounts.without(this.user).toArray());
      this.onClose();
      this.flashes.clear();
      this.flashes.success('You have been successfully placed on the waitlist for beta!');
    } catch (error) {
      this.flashes.clear();
      this.flashes.error('There was some error. Please try again later.');
    }
  }).drop(),

  didRender() {
    this.selectedAccounts.addObject(this.user);
  },

  actions: {

    onClose() {
      this.onClose();
    },

    preventErase(select, { keyCode, target }) {
      return keyCode !== 8 || !!target.value;
    }

  }

});
