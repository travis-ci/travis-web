import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @alias('job.log') log: null,

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
