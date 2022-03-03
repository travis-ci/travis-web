import Controller from '@ember/controller';
import moment from 'moment';
const timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
export default Controller.extend({
  selectedRepoIds: '',
  startTime: moment().startOf('month').format(timeFormat),
  endTime: moment().endOf('month').format(timeFormat),
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
    }
  }
});
