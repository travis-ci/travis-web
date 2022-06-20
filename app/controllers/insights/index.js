import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import moment from 'moment';
const timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
export default Controller.extend({
  selectedRepoIds: '',
  convertToTimeZone(time) {
    if (this.timeZone !== '') {
      return moment(time, timeFormat).tz(this.timeZone);
    } else if (this.browserTimeZone !== '') {
      return moment(time, timeFormat).tz(this.browserTimeZone);
    } else {
      return moment(time, timeFormat).utc();
    }
  },
  startTime: computed('convertToTimeZone', function () {
    return this.convertToTimeZone(moment()).startOf('month').format(timeFormat);
  }),
  endTime: computed('convertToTimeZone', function () {
    return this.convertToTimeZone(moment()).endOf('month').format(timeFormat);
  }),
  currentRepos: {},
  preferences: service(),
  timeZone: computed('preferences.insightsTimeZone', function () {
    if (this.preferences.insightsTimeZone) {
      return this.preferences.insightsTimeZone.substr(this.preferences.insightsTimeZone.indexOf(')') + 2);
    } else return '';
  }),
  browserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  actions: {
    setSelectedRepoIds(val) {
      this.set('selectedRepoIds', val);
    },
    setStartMonth(startDateVal) {
      this.set('startTime', `${startDateVal}-01`);
    },
    setEndMonth(endDateVal) {
      endDateVal = moment(`${endDateVal}-01`).endOf('month').format(timeFormat);
      this.set('endTime', `${endDateVal}`);
    },
    setCurrentRepos(repos) {
      this.set('currentRepos', repos);
    }
  },
  init() {
    this._super(...arguments);
    this.preferences.fetchPreferences.perform();
  }
});
