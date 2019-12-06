import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { filter, reads, gt } from '@ember/object/computed';

const FINISHED_STATES = ['failed', 'canceled', 'passed'];
const RUNNING_STATES = ['started', 'received'];
const QUEUED_STATES = ['created', 'queued'];
const RUNNING_AND_FINISHED_STATES = RUNNING_STATES.concat(FINISHED_STATES);

export default Service.extend({
  store: service(),

  jobs: reads('fetchJobs.lastSuccessful.value'),
  jobsLoaded: gt('fetchJobs.performCount', 0),

  runningJobs: filter('jobs', function (job) {
    return RUNNING_AND_FINISHED_STATES.includes(job.state);
  }),

  queuedJobs: filter('jobs', function (job) {
    return QUEUED_STATES.includes(job.state);
  }),

  fetchJobs: task(function* (options = {}) {
    const { usePeek } = options;
    if (usePeek) {
      return this.store.peekAll('job');
    } else {
      const allPendingStates = QUEUED_STATES.concat(RUNNING_STATES);
      //return yield fetchAll(this.store, 'job', { state: allPendingStates });
      return yield this.store.query('job', { state: allPendingStates });
    }
  })
});
