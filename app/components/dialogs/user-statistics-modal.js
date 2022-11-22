import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({
  store: service(),
  dateCenter: null,
  dateRange: null,
  showDatePicker: false,
  perPage: 10,
  users: reads('owner.executionsPerSender'),
  usersCount: reads('owner.executionsPerSender.length'),

  init() {
    this._super(...arguments);
    this.page = 1;
  },

  showPrev: computed('page', 'usersCount', function () {
    return this.page > 1;
  }),

  showNext: computed('page', 'usersCount', function () {
    return this.page < this.maxPages;
  }),

  maxPages: computed('usersCount', function () {
    return Math.ceil(this.usersCount / this.perPage);
  }),

  usersToShow: computed('users', 'page', function () {
    return this.users.slice((this.page - 1) * this.perPage, this.page * this.perPage);
  }),

  actions: {
    datePicker() {
      this.set('showDatePicker', !this.showDatePicker);
      if (!this.showDatePicker) {
        this.account.fetchExecutionsPerSender.perform(moment(this.dateRange.start).format('YYYY-MM-DD'),
          moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD'));
      }
    },
    setPage(newPage) {
      this.set('page', newPage);
    }
  }
});
