import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import moment from 'moment';
const timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
export default Component.extend({
  api: service(),
  timeZone: '',
  browserTimeZone: '',
  startTime: '',
  endTime: '',
  currentBuildTotal: 0,
  currentCreditsTotal: 0,
  currentMinutesTotal: 0,
  pastBuildTotal: 0,
  pastCreditsTotal: 0,
  pastMinutesTotal: 0,
  percentageBuildDiff: 0,
  percentageMinutesDiff: 0,
  percentageCreditsDiff: 0,
  selectedRepoIds: '',
  fetchData: task(function* (startTime, endTime) {
    let repoId = '';
    repoId = this.get('selectedRepoIds');
    if (repoId != '') {
      return yield this.api
        .get(
          `/spotlight_summary?time_start=${startTime}&time_end=${endTime}&repo_id=${repoId}`
        ) || [];
    } else {
      return yield this.api
        .get(
          `/spotlight_summary?time_start=${startTime}&time_end=${endTime}`
        ) || [];
    }
  }),
  fxTotal(data, prop) {
    let num = data.map((prev) => prev[prop]).reduce((curr, prev) => curr + prev, 0);
    return num;
  },
  fxPercentChange: function fxPercentChange(current, past) {
    let perChange = 0;
    if (past != 0) {
      const change = ((current - past) / past);
      const percent = change * 100;
      perChange = (Math.round(percent * 10) / 10);
      perChange = perChange > 0 ? `+${perChange}` : perChange;
    }
    return perChange;
  },
  toTimeZone(time) {
    if (this.timeZone !== '') {
      return moment.tz(time, timeFormat, this.timeZone).utc().format(timeFormat);
    } else if (this.browserTimeZone !== '') {
      return moment.tz(time, timeFormat, this.browserTimeZone).utc().format(timeFormat);
    } else {
      return moment.utc(time).format(timeFormat);
    }
  },
  currentDurationData(data) {
    this.set('currentBuildTotal', this.fxTotal(data, 'builds'));
    this.set('currentMinutesTotal', parseInt((this.fxTotal(data, 'duration') / 60)));
    this.set('currentCreditsTotal', this.fxTotal(data, 'credits'));
  },
  proportionalDurationData(data) {
    this.set('pastBuildTotal', this.fxTotal(data, 'builds'));
    this.set('pastMinutesTotal', parseInt((this.fxTotal(data, 'duration') / 60)));
    this.set('pastCreditsTotal', this.fxTotal(data, 'credits'));
    this.set('percentageBuildDiff', this.fxPercentChange(this.currentBuildTotal, this.pastBuildTotal));
    this.set('percentageMinutesDiff', this.fxPercentChange(this.currentMinutesTotal, this.pastMinutesTotal));
    this.set('percentageCreditsDiff', this.fxPercentChange(this.currentCreditsTotal, this.pastCreditsTotal));
  },
  updateAggregate: task(function* () {
    let startTime = moment(this.startTime).startOf('day').format(timeFormat);
    let endTime = moment(this.endTime).endOf('day').format(timeFormat);
    let monthsDiff = moment(endTime).diff(startTime, 'month');
    let prevStartTime = moment(startTime).subtract(monthsDiff + 1, 'month').startOf('month').format(timeFormat);
    let prevEndTime = moment(endTime).subtract(monthsDiff + 1, 'month').endOf('month').format(timeFormat);
    if (moment(startTime.split('T')[0]).isBefore(endTime.split('T')[0])) {
      startTime = this.toTimeZone(startTime);
      endTime = this.toTimeZone(endTime);
      prevStartTime = this.toTimeZone(prevStartTime);
      prevEndTime = this.toTimeZone(prevEndTime);
      let currentResponseData = yield this.fetchData.perform(startTime, endTime);
      this.setCurrentRepos(currentResponseData);
      let proportionalResponseData = yield this.fetchData.perform(prevStartTime, prevEndTime);
      this.currentDurationData(currentResponseData.data);
      this.proportionalDurationData(proportionalResponseData.data);
    }
  }),
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('selectedRepoIds', this.selectedRepoIds);
    this.set('startTime', this.startTime);
    this.set('endTime', this.endTime);
    this.set('timeZone', this.timeZone);
    this.set('browserTimeZone', this.browserTimeZone);
    this.updateAggregate.perform();
  },
});
