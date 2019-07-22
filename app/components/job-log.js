import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  log: alias('job.log'),

  classNames: ['job-log'],

  didReceiveAttrs() {
    let oldJob = this._oldJob;
    let newJob = this.job;

    if (newJob !== oldJob) {
      if (oldJob) {
        this.teardownLog(oldJob);
      }

      if (newJob) {
        this.setupLog.perform(newJob);
      }
    }

    this.set('_oldJob', this.job);
  },

  teardownLog(job) {
    job.unsubscribe();
  },

  setupLog: task(function* (job) {
    this.set('error', false);
    try {
      yield job.get('log.fetchTask').perform();
    } catch (e) {
      this.set('error', true);
    }
    job.subscribe();
  }),
});
