import Component from '@ember/component';

import { computed } from '@ember/object';
import { and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';

export default Component.extend({
  api: service(),
  storage: service(),

  lsSeats: 'travis.enterprise.seats_msg_seen',

  didInsertElement() {
    this._super(...arguments);

    this.fetchData.perform();
  },

  fetchData: task(function* () {
    const url = '/v3/enterprise_license';

    const response = yield this.api.get(url);

    this.setProperties({
      licenseId: response.license_id,
      seats: response.seats,
      activeUsers: response.active_users,
      isPaid: response.license_type !== 'trial'
    });
  }),

  exceedingSeats: computed('seats', 'activeUsers', function () {
    let seats = this.seats;
    let activeUsers = this.activeUsers;
    return (activeUsers > seats);
  }),

  almostExceedingSeats: computed('seats', 'activeUsers', function () {
    let seats = this.seats;
    let activeUsers = this.activeUsers;
    return (seats - activeUsers <= 5);
  }),

  showSeatsBanner: and('isPaid', 'checkSeatsBanner'),

  checkSeatsBanner: computed('almostExceedingSeats', 'exceedingSeats', function () {
    let almostExceeding = this.almostExceedingSeats;
    let exceeding = this.exceedingSeats;
    let closed = this.storage.getItem(this.lsSeats);
    if (!closed && (almostExceeding || exceeding)) {
      return true;
    }  else {
      return false;
    }
  }),

  showEnterpriseBanner: computed('showSeatsBanner', {
    get() {
      if (isPresent(this._showEnterpriseBanner)) {
        return this._showEnterpriseBanner;
      }
      return this.showSeatsBanner;
    },
    set(key, value) {
      this.set('_showEnterpriseBanner', value);
      return this._showEnterpriseBanner;
    }
  }),

  actions: {
    closeSeatsBanner() {
      this.storage.setItem(this.lsSeats, 'true');
      this.set('showEnterpriseBanner', false);
    }
  }
});
