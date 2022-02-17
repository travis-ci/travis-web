import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import moment from 'moment';
const timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
export default Component.extend({
  api: service(),
  preferences: service(),
  timeZone: computed('preferences.insightsTimeZone', function () {
    if (this.preferences.insightsTimeZone) {
      return this.preferences.insightsTimeZone.substr(this.preferences.insightsTimeZone.indexOf(')') + 2);
    } else return '';
  }),
  startTime: moment().startOf('month').format(timeFormat),
  endTime: moment().endOf('month').format(timeFormat),
  currentBuildTotal: 0,
  currentCreditsTotal: 0,
  currentMinutesTotal: 0,
  pastBuildTotal: 0,
  pastCreditsTotal: 0,
  pastMinutesTotal: 0,
  percentageBuildDiff: 0,
  percentageMinutesDiff: 0,
  percentageCreditDiff: 0,
  fetchData: task(function* (startTime, endTime) {
    return yield this.api
      .get(
        `/insights_spotlight_summary?time_start=${startTime}&time_end=${endTime}`
      ) || [];
  }),
  fxTotal(data, prop) {
    let num = data.map((prev) => prev[prop]).reduce((curr, prev) => curr + prev, 0);
    return num;
  },
  fxPercentChange: function fxPercentChange(current, past) {
    if (current && past) {
      const change = ((current - past) / past);
      const percent = change * 100;
      let perChange = (Math.round(percent * 10) / 10);
      perChange = perChange > 0 ? `+${perChange}` : perChange;
      return perChange;
    }
  },
  fxProportionalDuration(startDate, endDate) {
    let prevEndTime = moment(startDate).subtract(1, 'days').format(timeFormat);
    let monthdiff = moment(endDate).diff(moment(startDate), 'months');
    let prevStartTime = moment(startDate).subtract(monthdiff + 1, 'months').format(timeFormat);
    return {
      'prevStartTime': prevStartTime,
      'prevEndTime': prevEndTime
    };
  },
  toTimeZone(time, zone) {
    return moment(time, timeFormat).tz(zone).format(timeFormat);
  },
  currentDurationData(data) {
    this.set('currentBuildTotal', this.fxTotal(data, 'builds'));
    this.set('currentMinutesTotal', this.fxTotal(data, 'minutes'));
    this.set('currentCreditsTotal', this.fxTotal(data, 'credits'));
  },
  proportionalDurationData(data) {
    this.set('pastBuildTotal', this.fxTotal(data, 'builds'));
    this.set('pastMinutesTotal', this.fxTotal(data, 'minutes'));
    this.set('pastCreditsTotal', this.fxTotal(data, 'credits'));
    this.set('percentageBuildDiff', this.fxPercentChange(this.currentBuildTotal, this.pastBuildTotal));
    this.set('percentageMinutesDiff', this.fxPercentChange(this.currentMinutesTotal, this.pastMinutesTotal));
    this.set('percentageCreditsDiff', this.fxPercentChange(this.currentCreditsTotal, this.pastCreditsTotal));
  },
  updateAggregate: task(function* () {
    let startTime = `${this.startTime}T00:00:00.000`;
    let endTime = `${this.endTime}T00:00:00.000`;
    if (moment(startTime.split('T')[0]).isBefore(endTime.split('T')[0])) {
      if (this.timeZone != '') {
        startTime = this.toTimeZone(startTime, this.timeZone);
        endTime = this.toTimeZone(endTime, this.timeZone);
      }
      let ProportionalDuration = this.fxProportionalDuration(startTime, endTime);
      let currentResponseData = yield this.fetchData.perform(startTime, endTime);
      let proportionalResponseData = yield this.fetchData.perform(ProportionalDuration.prevStartTime, ProportionalDuration.prevEndTime);
      this.currentDurationData(currentResponseData.data);
      this.proportionalDurationData(proportionalResponseData.data);
    }
  }),
  init() {
    this._super(...arguments);
    this.preferences.fetchPreferences.perform();
    this.updateAggregate.perform();
  },
  actions: {
    setStartMonth(month) {
      let startDateVal = document.querySelector('.startDate').value;
      this.set('startTime', `${startDateVal}-01`);
      this.updateAggregate.perform();
    },
    setEndMonth(month) {
      let endDateVal = document.querySelector('.endDate').value;
      endDateVal = moment(`${endDateVal}-01`).endOf('month').format(timeFormat);
      this.set('endTime', `${endDateVal}`);
      this.updateAggregate.perform();
    }
  },
});
