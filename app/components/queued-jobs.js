import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
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
