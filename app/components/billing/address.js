import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { countries, nonZeroVatThresholdCountries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  flashes: service(),
  raven: service(),
  classNames: ['address'],
  openEditContactForm: false,
  openEditBillingForm: false,

  editContact: task(function* () {
    try {
      if (
        nonZeroVatThresholdCountries.includes(this.subscription.billingInfo.country) &&
        this.subscription.billingInfo.hasLocalRegistration === false
      ) {
        this.subscription.billingInfo.set('vatId', null);
      }

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

  billingFormTriggered: observer('openEditBillingForm', function () {
    if (!this.openEditBillingForm && this.subscription.billingInfo.hasDirtyAttributes) {
      this.subscription.billingInfo.rollbackAttributes();
    }
    if (this.openEditBillingForm && this.openEditContactForm) {
      this.set('openEditContactForm', false);
    }
  }),

  contactFormTriggered: observer('openEditContactForm', function () {
    if (!this.openEditContactForm && this.subscription.billingInfo.hasDirtyAttributes) {
      this.subscription.billingInfo.rollbackAttributes();
    }
    if (this.openEditContactForm && this.openEditBillingForm) {
      this.set('openEditBillingForm', false);
    }
  }),

  closeEditForms() {
    this.set('openEditContactForm', false);
    this.set('openEditBillingForm', false);
  },
});
