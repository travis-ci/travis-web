import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['job-log'],
  store: service('store'),

  _oldJob: null,

  job: null,
  log: reads('job.log'),

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
    yield this.store.findRecord('job', job.id, {
      reload: false,
      backgroundReload: false
    });
    this.set('error', false);
    try {
      yield job.get('log.fetchTask').perform();
    } catch (e) {
      this.set('error', true);
    }

    yield job.subscribe();
  })
});
