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
  selectedOptions: map('selectedAccounts', makeOptionFromAccount),

  selectableAccounts: computed('accounts.organizations.[]', 'user', function () {
    const accountOrgs = this.accounts.organizations || [];
    const organizations = accountOrgs.toArray() || [];
    return [this.user, ...organizations]; // user account must be first item, so that it couldn't be removed from selected options
  }),
  selectableOptions: map('selectableAccounts', makeOptionFromAccount),

  onClose() {},

  register: task(function* () {
    try {
      yield this.user.joinMigrateBeta(this.selectedAccounts.without(this.user).toArray());
      this.onClose();
      this.flashes.clear();
      this.flashes.success('You have successfully joined the beta!');
    } catch (error) {
      this.flashes.clear();
      this.flashes.error('There was an error. Please try again later.', undefined, true);
    }
  }).drop(),

  init() {
    this._super(...arguments);
    this.selectOptions([this.user]);
  },

  selectOptions(options = []) {
    const optionIds = options.mapBy('id');
    const selectedAccounts = this.selectableAccounts.filter(
      acc => optionIds.includes(acc.id)
    );
    this.set('selectedAccounts', selectedAccounts);
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
  const { id, title, isMigrationBetaAccepted, isOrganization, isUser } = account;
  const isNotAdmin = isOrganization && !account.get('permissions.admin');
  const state = isMigrationBetaAccepted ? 'subscribed' : isNotAdmin ? 'not admin' : '';
  const disabled = isOrganization && isMigrationBetaAccepted || isUser || isNotAdmin;
  return { id, title, state, disabled };
}
