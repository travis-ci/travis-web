import Ember from 'ember';
import Config from 'travis/config/environment';
import eventually from 'travis/utils/eventually';

export default Ember.Service.extend({
  records: [],
  allowFinishedBuilds: false,

  init() {
    this.set('visibilityId', Visibility.every(Config.intervals.updateTimes, this.updateTimes.bind(this)));
    this.set('intervalId', setInterval(this.resetAllowFinishedBuilds.bind(this), 60000));

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

    records.filter((record) => {
      return this.get('allowFinishedBuilds') || !record.get('isFinished');
    }).forEach((record) => {
      eventually(record, function(resolvedRecord) {
        if(resolvedRecord) {
          resolvedRecord.updateTimes();
        }
      });
    });

    this.set('records', []);

    if(this.get('allowFinishedBuilds')) {
      this.set('allowFinishedBuilds', false);
    }
  },

  pushObject(record) {
    let records = this.get('records');

    if(!records.contains(record)) {
      records.pushObject(record);
    }
  },

  push(model) {
    if(!model) { return; }

    if(model.forEach) {
      model.forEach( (element) => {
        this.pushObject(element);
      });
    } else {
      this.pushObject(model);
    }
  }
});
