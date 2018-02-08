import Ember from 'ember';

import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default Ember.Component.extend({
	@service ajax: null,

  init() {
    this._super(...arguments);

    const url = '/v3/enterprise_license';
    this.get('ajax').get(url).then(response => {
      Ember.run(() => {
        this.set('licenseId', response.license_id);
        this.set('expirationTime', new Date(Date.parse(response.expiration_time)));
        this.set('licenseType', response.license_type);
        this.set('seats', response.seats);
        this.set('activeUsers', response.active_users);
      });
    });
  },

  @computed('seats', 'activeUsers')
  exceedingSeats(seats, activeUsers) {
    if (activeUsers > seats) {
      return true;
    }
  },

  @computed('seats', 'activeUsers')
  almostExceedingSeats(seats, activeUsers) {
    if (seats - activeUsers > 5) {
      return false;
    }
  },

  @computed('licenseType')
  isTrial(licenseType) {
    return (licenseType === 'trial');
  },

  @computed('expirationTime')
  isExpired(expirationTime) {
    return new Date() > expirationTime;
  },

  @computed('expirationTime')
  expirationTimeFromNow(expirationTime) {
    return new Ember.String.htmlSafe(timeAgoInWords(expirationTime) || '-');
  },

  @computed('expirationTime')
  expirationIn60Days(expirationTime) {
    if (!expirationTime) {
      return false;
    }

    const daysFromNowThatLicenseExpires =
            (expirationTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

    return daysFromNowThatLicenseExpires < 61;
  },

  @computed('expirationTime')
  expirationIn30Days(expirationTime) {
    if (!expirationTime) {
      return false;
    }

    const daysFromNowThatLicenseExpires =
            (expirationTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

    return daysFromNowThatLicenseExpires < 31;
  },

  @computed('expirationTime')
  expirationIn10Days(expirationTime) {
    if (!expirationTime) {
      return false;
    }

    const daysFromNowThatLicenseExpires =
            (expirationTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

    return daysFromNowThatLicenseExpires < 11;
  },

  showBanner: true
});
