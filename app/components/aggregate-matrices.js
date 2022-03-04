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
    const change = ((current - past) / past);
    const percent = change * 100;
    let perChange = (Math.round(percent * 10) / 10);
    perChange = perChange > 0 ? `+${perChange}` : perChange;
    return perChange;
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
    let startTime = this.startTime.includes('T') ? `${this.startTime}` : `${this.startTime}T00:00:00.000`;
    let endTime = this.endTime.includes('T') ? `${this.endTime}` : `${this.endTime}T00:00:00.000`;
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
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('selectedRepoIds', this.selectedRepoIds);
    this.set('startTime', this.startTime);
    this.set('endTime', this.endTime);
    this.preferences.fetchPreferences.perform();
    this.updateAggregate.perform();
  }
});
