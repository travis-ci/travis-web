import Ember from 'ember';
import computed from 'ember-computed-decorators';
import config from 'travis/config/environment';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

const { service } = Ember.inject;

const DAYS_FROM_NOW_THAT_EXPIRATION_TIME_IS_IMMINENT = 21;

export default Ember.Component.extend({
  ajax: service(),

  init() {
    this._super(...arguments);

    const replicatedApiEndpoint = config.replicatedApiEndpoint;

    if (replicatedApiEndpoint) {
      const url = `${replicatedApiEndpoint}/license/v1/license`;

      Ember.$.ajax(url).then(response => {
        Ember.run(() => {
          this.set('licenseExpirationTime', new Date(Date.parse(response.expiration_time)));
          this.set('licenseType', response.license_type);
          this.set('billingFrequency', response.billing_frequency);
        });
      });
    }
  },

  @computed('licenseType', 'billingFrequency')
  isTrial(licenseType, billingFrequency) {
    return ((licenseType && licenseType == 'trial') || !licenseType) && !billingFrequency;
  },

  @computed('licenseExpirationTime')
  isExpired(licenseExpirationTime) {
    return new Date() > licenseExpirationTime;
  },

  @computed('licenseExpirationTime')
  expirationTimeFromNow(licenseExpirationTime) {
    return new Ember.String.htmlSafe(timeAgoInWords(licenseExpirationTime) || '-');
  },

  @computed('licenseExpirationTime')
  licenseExpirationIsImminent(licenseExpirationTime) {
    if (!licenseExpirationTime) {
      return false;
    }

    const daysFromNowThatLicenseExpires =
      (licenseExpirationTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

    return daysFromNowThatLicenseExpires < DAYS_FROM_NOW_THAT_EXPIRATION_TIME_IS_IMMINENT;
  },

  showBanner: Ember.computed.or('isTrial', 'licenseExpirationIsImminent')
});
