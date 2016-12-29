import Ember from 'ember';
import config from 'travis/config/environment';
import eventually from 'travis/utils/eventually';
import Visibility from 'npm:visibilityjs';

export default Ember.Service.extend({
  records: [],
  allowFinishedBuilds: false,

  init() {
    let visibilityId = Visibility.every(
      config.intervals.updateTimes,
      Ember.run.bind(this, 'updateTimes')
    );
    this.set('visibilityId', visibilityId);
    let intervalId = setInterval(
      this.resetAllowFinishedBuilds.bind(this),
      60000
    );
    this.set('intervalId', intervalId);

    return this._super(...arguments);
  },

  willDestroy() {
    Visibility.stop(this.get('visibilityId'));
    clearInterval(this.get('intervalId'));
    this._super(...arguments);
  },

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
