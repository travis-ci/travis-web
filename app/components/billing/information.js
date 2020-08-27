import Component from '@ember/component';
import { countries, zeroVatThresholdCountries, nonZeroVatThresholdCountries } from 'travis/utils/countries';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  countries,

  billingInfo: reads('newSubscription.billingInfo'),

  country: reads('billingInfo.country'),

  isZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && zeroVatThresholdCountries.includes(country);
  }),

  isNonZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && nonZeroVatThresholdCountries.includes(country);
  }),

  isVatMandatory: computed('isNonZeroVatThresholdCountry', 'isRegisteredForLocalVat', function () {
    const { isNonZeroVatThresholdCountry, isZeroVatThresholdCountry, isRegisteredForLocalVat } = this;
    return isZeroVatThresholdCountry || (isNonZeroVatThresholdCountry ? isRegisteredForLocalVat : false);
  }),

  showNonZeroVatConfirmation: reads('isNonZeroVatThresholdCountry'),

  showVatField: computed('country', 'isNonZeroVatThresholdCountry', 'isRegisteredForLocalVat', function () {
    const { country, isNonZeroVatThresholdCountry, isRegisteredForLocalVat } = this;
    return country && (isNonZeroVatThresholdCountry ? isRegisteredForLocalVat : true);
  }),

  actions: {
    updateEmails(values) {
      this.billingInfo.set('billingEmail', values.join(','));
    },
  }
});
