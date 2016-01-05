import Ember from 'ember';

export default Ember.Component.extend({
  logBinding: 'job.log',

  didInsertElement() {
    return this.setupLog();
  },

  logDidChange: function() {
    return this.setupLog();
  }.observes('log'),

  logWillChange: function() {
    return this.teardownLog();
  }.observesBefore('log'),

  willDestroyElement() {
    return this.teardownLog();
  },

  teardownLog() {
    var job;
    job = this.get('job');
    if (job) {
      return job.unsubscribe();
    }
  },

  setupLog() {
    var job;
    job = this.get('job');
    if (job) {
      job.get('log').fetch();
      return job.subscribe();
    }
  }
});
