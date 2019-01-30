import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-dates'],

  insights: service(),

  interval: 'month',

  dates: computed('interval', function () {
    return this.get('insights').getDatesFromInterval(this.interval);
  }),

  startDate: computed('dates', function () {
    if (this.dates.length === 2) {
      return moment(this.dates[0]).format('MMMM DD, YYYY');
    }
    return '...';
  }),

  endDate: computed('dates', function () {
    if (this.dates.length === 2) {
      return moment(this.dates[1]).format('MMMM DD, YYYY');
    }
    return '...';
  }),
});
