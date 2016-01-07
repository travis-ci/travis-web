import Ember from 'ember';

export default Ember.Component.extend({
  logBinding: 'job.log',

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, 'setupLog');
  },

  logDidChange: function() {
    return this.setupLog();
  }.observes('log'),

  logWillChange: function() {
    return this.teardownLog();
  }.observesBefore('log'),

  willDestroyElement() {
    Ember.run.scheduleOnce('afterRender', this, 'teardownLog');
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
