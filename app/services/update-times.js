import Service from '@ember/service';
import eventually from 'travis/utils/eventually';

export default Service.extend({
  records: [],
  allowFinishedBuilds: false,

  resetAllowFinishedBuilds() {
    this.set('allowFinishedBuilds', true);
  },

  updateTimes() {
    let records = this.get('records');

    records.filter(record => this.get('allowFinishedBuilds') || !record.get('isFinished'))
      .forEach((record) => {
        eventually(record, resolvedRecord => {
          if (resolvedRecord) {
            resolvedRecord.updateTimes();
          }
        });
      });

    this.set('records', []);

    if (this.get('allowFinishedBuilds')) {
      this.set('allowFinishedBuilds', false);
    }
  },

  pushObject(record) {
    let records = this.get('records');

    if (!records.includes(record)) {
      records.pushObject(record);
    }
  },

  push(model) {
    if (!model) { return; }

    if (model.forEach) {
      model.forEach((element) => {
        this.pushObject(element);
      });
    } else {
      this.pushObject(model);
    }
  }
});
