import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  flashes: service(),
  classNames: ['address'],
  openEditContactForm: false,
  openEditBillingForm: false,

  editContact: task(function* () {
    try {
      yield this.subscription.save();
      this.closeEditForms();
    } catch (e) {
      this.handleErrors(e);
    }
  }).drop(),

  handleErrors(e) {
    if (e.errors.length) {
      const message = e.errors[0].detail;
      this.flashes.error(message);
    }
  },

  closeEditForms() {
    this.set('openEditContactForm', false);
    this.set('openEditBillingForm', false);
  },
});
