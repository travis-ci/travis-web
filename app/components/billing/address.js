import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  flashes: service(),
  raven: service(),
  classNames: ['address'],
  openEditContactForm: false,
  openEditBillingForm: false,

  editContact: task(function* () {
    try {
      yield this.subscription.save();
      this.closeEditForms();
      this.flashes.clear();
    } catch (error) {
      let errorMessage = 'There was an error updating your contact. Please verify you provided a valid VAT number';
      const hasErrorMessage = error && error.errors && error.errors.length > 0;
      if (hasErrorMessage) {
        errorMessage = error.errors[0].detail;
      }
      this.flashes.error(errorMessage);
      this.raven.logException(error);
    }
  }).drop(),

  closeEditForms() {
    this.set('openEditContactForm', false);
    this.set('openEditBillingForm', false);
  },
});
