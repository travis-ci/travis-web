import Component from '@ember/component';

import { computed } from '@ember/object';
import { and, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default Component.extend({
  ajax: service(),
  storage: service(),

  lsLicense: 'travis.enterprise.license_msg_last_seen',
  lsSeats: 'travis.enterprise.seats_msg_seen',

  didInsertElement() {
    this._super(...arguments);

    this.get('fetchData').perform();
  },

  fetchData: task(function* () {
    const url = '/v3/enterprise_license';

    let response = yield this.get('ajax').get(url);

    const exp = new Date(Date.parse(response.expiration_time));
    this.setProperties({
      licenseId: response.license_id,
      expirationTime: exp,
      daysUntilExpiry: Math.ceil(
        (exp.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
      licenceType: response.license_type,
      seats: response.seats,
      activeUsers: response.active_users,
      isTrial: response.license_type === 'trial',
      isPaid: response.license_type !== 'trial'
    });

    // Temporary removing these until we can rework these to be more
    // emberlike and resiliant to odd timing issues
    // if (this.get('daysUntilExpiry') && !this.get('expiring')) {
    //  this.get('storage').removeItem(this.get('lsLicense'));
    // }
    // if (!this.get('almostExceedingSeats') && !this.get('exceedingSeats')) {
    //   this.get('storage').removeItem(this.get('lsSeats'));
    // }
  }),

  exceedingSeats: computed('seats', 'activeUsers', function () {
    let seats = this.get('seats');
    let activeUsers = this.get('activeUsers');
    return (activeUsers > seats);
  }),

  almostExceedingSeats: computed('seats', 'activeUsers', function () {
    let seats = this.get('seats');
    let activeUsers = this.get('activeUsers');
    return (seats - activeUsers <= 5);
  }),

  isExpired: computed('expirationTime', function () {
    let expirationTime = this.get('expirationTime');
    return new Date() > expirationTime;
  }),

  expirationTimeFromNow: computed('expirationTime', function () {
    let expirationTime = this.get('expirationTime');
    return new htmlSafe(timeAgoInWords(expirationTime) || '-');
  }),

  expiring: computed('daysUntilExpiry', function () {
    let days = this.get('daysUntilExpiry');
    if (!days) return false;
    return days <= 60;
  }),

  expiringHalfway: computed('daysUntilExpiry', function () {
    let days = this.get('daysUntilExpiry');
    if (!days) return false;
    return days <= 30;
  }),

  expiringSoon: computed('daysUntilExpiry', function () {
    let days = this.get('daysUntilExpiry');
    if (!days) return false;
    return days <= 10;
  }),

  checkLicenseBanner: computed('expiring', 'expiringHalfway', 'expiringSoon', function () {
    let expiring = this.get('expiring');
    let halfway = this.get('expiringHalfway');
    let soon = this.get('expiringSoon');
    let lastSeen = this.get('storage').getItem(this.get('lsLicense'));
    if (
      // User has never closed banner, and license expires in 60 days or less
      (!lastSeen && expiring) ||
      // User has either never closed the banner, or closed it before 30 days,
      // and license expires in 30 days or less
      ((!lastSeen || lastSeen > 30) && halfway) ||
      // License expires in 10 days or less
      (soon)
    ) {
      return true;
    } else {
      return false;
    }
  }),

  showTrialBanner: alias('isTrial'),

  showLicenseBanner: and('isPaid', 'checkLicenseBanner'),

  showSeatsBanner: and('isPaid', 'checkSeatsBanner'),

  checkSeatsBanner: computed('almostExceedingSeats', 'exceedingSeats', function () {
    let almostExceeding = this.get('almostExceedingSeats');
    let exceeding = this.get('exceedingSeats');
    let closed = this.get('storage').getItem(this.get('lsSeats'));
    if (exceeding) {
      return true;
    } else if (almostExceeding && !closed) {
      return true;
    } else {
      return false;
    }
  }),

  licenseClass: computed('expiresSoon', function () {
    let expiresSoon = this.get('expiresSoon');
    if (expiresSoon) return 'alert';
  }),

  trialClass: null,
  seatsClass: 'alert',
  paidClass: 'alert',

  actions: {
    closeLicenseBanner() {
      this.get('storage').setItem(this.get('lsLicense'), this.get('daysUntilExpiry'));
      this.set('showLicenseBanner', false);
    },
    closeSeatsBanner() {
      this.get('storage').setItem(this.get('lsSeats'), true);
      this.set('showSeatsBanner', false);
    }
  }
});
