import Ember from 'ember';

export default Ember.Component.extend({
  log: Ember.computed.alias('job.log'),
  classNames: ['job-log'],

  didReceiveAttrs(options) {
    this._super(...arguments);

    let oldJob = options.oldAttrs && options.oldAttrs.job && options.oldAttrs.job.value,
      newJob = options.newAttrs && options.newAttrs.job && options.newAttrs.job.value;

    if (newJob !== oldJob) {
      if (newJob) {
        this.setupLog(newJob);
      }

      if (oldJob) {
        this.teardownLog(oldJob);
      }
    }
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
