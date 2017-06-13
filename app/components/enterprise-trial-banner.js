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
          const expirationTime = response.expiration_time;
          const licenseType = response.license_type;
          const billingFrequency = response.billing_frequency;

          const isTrial = ((licenseType && licenseType == 'trial') || !licenseType) &&
            !billingFrequency;

          this.set('licenseExpirationTime', new Date(Date.parse(expirationTime)));

          if (isTrial) {
            this.set('isTrial', true);
          }
        });
      });
    }
  },

  isTrial: false,

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
