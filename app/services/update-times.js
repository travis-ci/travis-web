import { bind } from '@ember/runloop';
import Service from '@ember/service';
import config from 'travis/config/environment';
import eventually from 'travis/utils/eventually';
import Visibility from 'visibilityjs';
import { task, timeout } from 'ember-concurrency';
import { on } from '@ember/object/evented';

export default Service.extend({
  allowFinishedBuilds: false,
  isDestroyedOrDestroying: false,

  init() {
    const records = [];

    this.setProperties({ records });

    return this._super(...arguments);
  },

  updateTimesTask: task(function* () {
    while (true) {
      yield this.updateTimes();
      yield timeout(config.intervals.updateTimes);
    }
  }).on('init'),


  willDestroy() {
    this.set('isDestroyedOrDestroying', true);
    this._super(...arguments);
  },

  resetAllowFinishedBuilds() {
    if (this.isDestroyedOrDestroying) { return; }
    this.set('allowFinishedBuilds', true);
  },

  updateTimes() {
    if (this.isDestroyedOrDestroying) { return; }
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
