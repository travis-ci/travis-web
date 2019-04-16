import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, map } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  accounts: service(),
  flashes: service(),

  user: reads('accounts.user'),

  selectedAccounts: null,

  selectableAccounts: reads('accounts.organizations'),

  selectableOptions: map('selectableAccounts', makeOptionFromAccount),

  selectedOptions: computed('selectableOptions', 'selectedAccounts', function () {
    const { selectableOptions, selectedAccounts } = this;
    const accountOption = makeOptionFromAccount(this.user);
    const selectedOptions = selectableOptions.filter(option => selectedAccounts.mapBy('id').includes(option.id));
    return [accountOption, ...selectedOptions];
  }),

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

  init() {
    this._super(...arguments);
    this.selectOptions([]);
  },

  selectOptions(options = []) {
    const selectedAccounts = this.selectableAccounts.filter(acc => options.mapBy('id').includes(acc.id));
    this.set('selectedAccounts', [this.user, ...selectedAccounts]);
  },

  actions: {

    onClose() {
      this.onClose();
    },

    preventErase(select, { keyCode, target }) {
      return keyCode !== 8 || !!target.value;
    },

    selectOptions(options) {
      this.selectOptions(options);
    }

  }

});

function makeOptionFromAccount(account) {
  const { id, title, isMigrationBetaAccepted, isMigrationBetaRequested, isOrganization } = account;
  return {
    id,
    title,
    state: isMigrationBetaAccepted ? 'subscribed' : isMigrationBetaRequested ? 'waitlisted' : '',
    disabled: isOrganization && (isMigrationBetaAccepted || isMigrationBetaRequested)
  };
}
