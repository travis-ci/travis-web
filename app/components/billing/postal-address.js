import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { countries, zeroVatThresholdCountries, nonZeroVatThresholdCountries } from 'travis/utils/countries';

export default Component.extend({
  countries,

  billingInfo: null,

  hasLocalRegistration: reads('billingInfo.hasLocalRegistration'),
  country: reads('billingInfo.country'),

  isZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && zeroVatThresholdCountries.includes(country);
  }),

  isNonZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && nonZeroVatThresholdCountries.includes(country);
  }),

  isVatMandatory: computed('isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { isNonZeroVatThresholdCountry, isZeroVatThresholdCountry, hasLocalRegistration } = this;
    return isZeroVatThresholdCountry || (isNonZeroVatThresholdCountry ? hasLocalRegistration : false);
  }),

  showNonZeroVatConfirmation: reads('isNonZeroVatThresholdCountry'),

  showVatField: computed('country', 'isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { country, isNonZeroVatThresholdCountry, hasLocalRegistration } = this;
    return country && (isNonZeroVatThresholdCountry ? hasLocalRegistration : true);
  }),

});
