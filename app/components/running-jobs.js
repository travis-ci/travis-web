import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';

export default Ember.Component.extend(Polling, {
  store: Ember.inject.service(),

  pollHook(store) {
    return this.get('store').find('job', {});
  },

  init() {
    this._super.apply(this, arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    var jobs;
    if (jobs = this.get('jobs')) {
      return jobs.forEach(function(job) {
        return job.updateTimes();
      });
    }
  }
});
