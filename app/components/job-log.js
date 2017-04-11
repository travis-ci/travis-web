import Ember from 'ember';

export default Ember.Component.extend({
  log: Ember.computed.alias('job.log'),
  classNames: ['job-log'],

  didReceiveAttrs() {
    let oldJob = this.get('_oldJob');
    let newJob = this.get('job');

    if (newJob !== oldJob) {
      if (newJob) {
        this.setupLog(newJob);
      }

      if (oldJob) {
        this.teardownLog(oldJob);
      }
    }

    this.set('_oldJob', this.get('job'));
  },

  teardownLog(job) {
    job.unsubscribe();
  },

  setupLog(job) {
    this.set('error', false);
    job.get('log').fetch().then(() => { }, () => {
      this.set('error', true);
    });
    job.subscribe();
  }
});
