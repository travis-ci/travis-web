import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @alias('job.log') log: null,
  @service store: null,

  classNames: ['job-log'],

  didReceiveAttrs() {
    let oldJob = this.get('_oldJob');
    let newJob = this.get('job');

    if (newJob !== oldJob) {
      if (newJob) {
        this.setupLog.perform(newJob);
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
