import { bind } from '@ember/runloop';
import Service from '@ember/service';
import config from 'travis/config/environment';
import eventually from 'travis/utils/eventually';
import Visibility from 'visibilityjs';

export default Service.extend({
  allowFinishedBuilds: false,

  init() {
    const visibilityId = Visibility.every(config.intervals.updateTimes, bind(this, 'updateTimes'));
    const intervalId = setInterval(this.resetAllowFinishedBuilds.bind(this), 60000);
    const records = [];

    this.setProperties({ visibilityId, intervalId, records });

    return this._super(...arguments);
  },

  willDestroy() {
    Visibility.stop(this.visibilityId);
    clearInterval(this.intervalId);
    this._super(...arguments);
  },

  resetAllowFinishedBuilds() {
    this.set('allowFinishedBuilds', true);
  },

  updateTimes() {
    let records = this.records;

    records.filter(record => this.allowFinishedBuilds || !record.get('isFinished'))
      .forEach((record) => {
        eventually(record, resolvedRecord => {
          if (resolvedRecord) {
            resolvedRecord.updateTimes();
          }
        });
      });

    this.set('records', []);

    if (this.allowFinishedBuilds) {
      this.set('allowFinishedBuilds', false);
    }
  },

  pushObject(record) {
    let records = this.records;

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
