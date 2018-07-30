import Component from '@ember/component';

import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default Component.extend({
  @service ajax: null,
  @service storage: null,

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

  @computed('seats', 'activeUsers')
  exceedingSeats(seats, activeUsers) {
    return (activeUsers > seats);
  },

  @computed('seats', 'activeUsers')
  almostExceedingSeats(seats, activeUsers) {
    return (seats - activeUsers <= 5);
  },

  @computed('expirationTime')
  isExpired(expirationTime) {
    return new Date() > expirationTime;
  },

  @computed('expirationTime')
  expirationTimeFromNow(expirationTime) {
    return new htmlSafe(timeAgoInWords(expirationTime) || '-');
  },

  @computed('daysUntilExpiry')
  expiring(days) {
    if (!days) return false;
    return days <= 60;
  },

  @computed('daysUntilExpiry')
  expiringHalfway(days) {
    if (!days) return false;
    return days <= 30;
  },

  @computed('daysUntilExpiry')
  expiringSoon(days) {
    if (!days) return false;
    return days <= 10;
  },

  @computed('expiring', 'expiringHalfway', 'expiringSoon')
  checkLicenseBanner(expiring, halfway, soon) {
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
  },

  @alias('isTrial') showTrialBanner: null,

  @computed('isPaid', 'checkLicenseBanner')
  showLicenseBanner(isPaid, check) {
    return (isPaid && check);
  },

  @computed('isPaid', 'checkSeatsBanner')
  showSeatsBanner(isPaid, check) {
    return (isPaid && check);
  },


  @computed('almostExceedingSeats', 'exceedingSeats')
  checkSeatsBanner(almostExceeding, exceeding) {
    let closed = this.get('storage').getItem(this.get('lsSeats'));
    if (exceeding) {
      return true;
    } else if (almostExceeding && !closed) {
      return true;
    } else {
      return false;
    }
  },

  @computed('expiresSoon')
  licenseClass(expiresSoon) {
    if (expiresSoon) return 'alert';
  },

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
