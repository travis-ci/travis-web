import Component from '@ember/component';
import { alias } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  @alias('job.log') log: null,

  classNames: ['job-log'],

  didReceiveAttrs() {
    let oldJob = this.get('_oldJob');
    let newJob = this.get('job');

    if (newJob !== oldJob) {
      if (oldJob) {
        this.teardownLog(oldJob);
      }

      if (newJob) {
        this.get('setupLog').perform(newJob);
      }
    }

    this.set('_oldJob', this.get('job'));
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
