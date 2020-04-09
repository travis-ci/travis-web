import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { filter, reads, gt } from '@ember/object/computed';

export const FINISHED_STATES = ['failed', 'canceled', 'passed'];
export const RUNNING_STATES = ['started'];
export const QUEUED_STATES = ['created', 'queued', 'booting', 'received'];
export const UNFINISHED_STATES = QUEUED_STATES.concat(RUNNING_STATES);

export default Service.extend({
  store: service(),

  jobs: reads('peekJobs.lastSuccessful.value'),
  jobsLoaded: gt('fetchUnfinishedJobs.performCount', 0),
  sortedJobs: computed('jobs.@each.number', function () {
    const { jobs } = this;
    return jobs && jobs.sortBy('number');
  }),

  runningJobs: filter('sortedJobs.@each.state', (job) => RUNNING_STATES.includes(job.state)),
  queuedJobs: filter('sortedJobs.@each.state', (job) => QUEUED_STATES.includes(job.state)),
  unfinishedJobs: computed('queuedJobs.[]', 'runningJobs.[]', function () {
    return [...this.queuedJobs, ...this.runningJobs];
  }),

  peekJobs: task(function* () {
    return yield this.store.peekAll('job');
  }),

  fetchUnfinishedJobs: task(function* () {
    const unfinishedJobs = yield this.store.query('job', { state: UNFINISHED_STATES });
    yield this.peekJobs.perform();
    return unfinishedJobs;
  }),
});
