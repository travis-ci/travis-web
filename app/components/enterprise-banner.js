import Ember from 'ember';

import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

const DAYS_FROM_NOW_THAT_EXPIRATION_TIME_IS_IMMINENT = 21;

export default Ember.Component.extend({
  @service ajax: null,

  licenseType: 'regular',
  billingFrequency: 'annual',
  maxSeats: 30,
  licenseExpirationTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
  currentSeats: 27,

  /*
  init() {
    this._super(...arguments);

    // would we still need to check for enterprise then?
    const url = '/enterprise_license';
    this.get('ajax').get(url).then(response => {
    // if we don't check for enterprise before
    // should we check for 404 here?

     Ember.run(() => {

     this.set('licenseExpirationTime', new Date(Date.parse(response.expiration_time)));
     this.set('licenseType', response.license_type);
     this.set('billingFrequency', response.billing_frequency);
     this.set('maxSeats', response.seats);

     this.set('licenseExpirationTime', new Date(Date.parse(response.expiration_time)));
     );
    });
  },
   */

  @computed('maxSeats', 'currentSeats')
  exceedingSeats(maxSeats, currentSeats) {
    let tenPercent = maxSeats / 10;
    debugger
    return (currentSeats + tenPercent) >= maxSeats;
  },

  @computed('licenseType', 'billingFrequency')
  isTrial(licenseType, billingFrequency) {
    return ((licenseType && licenseType === 'trial') || !licenseType) && !billingFrequency;
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

  //showBanner: Ember.computed.or('isTrial', 'licenseExpirationIsImminent')
  showBanner: true
});
