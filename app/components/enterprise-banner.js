import Ember from 'ember';

import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default Ember.Component.extend({
  @service ajax: null,
  @service storage: null,

  key: 'travis.enterprise.license_msg_last_seen',

  didInsertElement() {
    this._super(...arguments);

    const url = '/v3/enterprise_license';

    this.get('ajax').get(url).then(response => {
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
      if (!this.get('expiring')) {
        this.get('storage').removeItem(this.get('key'));
      }
    });
  },

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
    return new Ember.String.htmlSafe(timeAgoInWords(expirationTime) || '-');
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
    let lastSeen = this.get('storage').getItem(this.get('key'));
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

  @computed('isPaid', 'almostExceedingSeats', 'exceedingSeats')
  showSeatsBanner(isPaid, almostExceeding, exceeding) {
    return (isPaid && (almostExceeding || exceeding));
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
      this.get('storage').setItem(this.get('key'), this.get('daysUntilExpiry'));
      this.set('showLicenseBanner', false);
    }
  }
});
