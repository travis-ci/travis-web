import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import moment from 'moment';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export const INSIGHTS_DATE_RANGE_FORMAT = 'MMMM DD, YYYY';
export const INSIGHTS_DATE_RANGE_PLACEHOLDER = '...';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-dates', 'snapshot-hide'],

  insights: service(),

  interval: DEFAULT_INSIGHTS_INTERVAL,

  dates: computed('interval', function () {
    return this.insights.getDatesFromInterval(this.interval);
  }),

  startDate: computed('dates.firstObject', function () {
    const { dates = [] } = this;
    return dates.firstObject ? moment(dates.firstObject).format(INSIGHTS_DATE_RANGE_FORMAT) : INSIGHTS_DATE_RANGE_PLACEHOLDER;
  }),

  endDate: computed('dates.lastObject', function () {
    const { dates = [] } = this;
    return dates.lastObject ? moment(dates.lastObject).format(INSIGHTS_DATE_RANGE_FORMAT) : INSIGHTS_DATE_RANGE_PLACEHOLDER;
  }),
});
