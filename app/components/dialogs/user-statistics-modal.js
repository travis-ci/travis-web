import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dateCenter: null,
  dateRange: null,
  showDatePicker: false,
  summarizedUsers: computed('owner.executions', 'dateRange', function () {
    let users = [];
    const executions = this.owner.get('executions');
    if (executions) {
      executions.forEach(async (execution) => {
        const user = users.find((item) => item.id === executions.sender_id);
        if (!user) {
          const userObj = this.store.peekRecord('user', execution.sender_id) || (await this.store.findRecord('user', execution.sender_id));
          users.push({
            id: executions.sender_id,
            name: userObj.fullName,
            email: userObj.email,
            avatarUrl: userObj.avatarUrl,
            provider: userObj.provider,
            vcsType: userObj.vcsType,
            buildMinutes: calculateMinutes(execution.started_at, execution.finished_at),
            buildCredits: execution.credits_consumed
          });
        } else {
          user.buildMinutes += calculateMinutes(execution.started_at, execution.finished_at);
          user.buildCredits += execution.credits_consumed;
        }
      });
    }
    return users;
  }),

  actions: {
    downloadCsv() {
      const startDate = moment(this.dateRange.start).format('YYYY-MM-DD');
      const endDate = moment(this.dateRange.end).format('YYYY-MM-DD');
      const fileName = `usage_${startDate}_${endDate}.csv`;

      const header = ['Job ID', 'Started at', 'Finished at', 'OS', 'Credits consumed', 'Minutes consumend', 'Repository', 'Owner', 'Sender'];
      const data = this.get('executionsDataForCsv');

      this.download.asCSV(fileName, header, data);
    },

    datePicker() {
      this.set('showDatePicker', !this.showDatePicker);
      if (!this.showDatePicker) {
        this.account.fetchExecutions.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
      }
    }
  }

});

const calculateMinutes = (start, finish) => {
  return start && finish ? (Date.parse(finish) - Date.parse(start)) / 1000 * 60 : 0;
}  
