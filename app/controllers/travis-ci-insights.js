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
    setStartMonth() {
      let startDateVal = document.querySelector('.startDate').value;
      this.set('startTime', `${startDateVal}-01`);
    },
    setEndMonth() {
      let endDateVal = document.querySelector('.endDate').value;
      endDateVal = moment(`${endDateVal}-01`).endOf('month').format(timeFormat);
      this.set('endTime', `${endDateVal}`);
    }
  }
});
