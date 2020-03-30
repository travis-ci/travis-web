import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { filter, reads, gt } from '@ember/object/computed';

const FINISHED_STATES = ['failed', 'canceled', 'passed'];
const RUNNING_STATES = ['started'];
const QUEUED_STATES = ['created', 'queued', 'booting', 'received'];
const RUNNING_AND_FINISHED_STATES = RUNNING_STATES.concat(FINISHED_STATES);
const DISPLAY_TIMEOUT_SEC = 30;

export default Service.extend({
  store: service(),

  jobs: reads('fetchJobs.lastSuccessful.value'),
  jobsLoaded: gt('fetchJobs.performCount', 0),

  runningJobs: filter('jobs', (job) => {
    let stillToShow = true;
    if (job.finishedAt) {
      const jobTime = new Date(job.finishedAt);
      const nowTime = new Date();
      stillToShow = !job.build.get('isFinished') || (nowTime.getTime() - jobTime.getTime()) <= DISPLAY_TIMEOUT_SEC;
    }
    return RUNNING_AND_FINISHED_STATES.includes(job.state) && stillToShow;
  }),
  queuedJobs: filter('jobs', (job) => QUEUED_STATES.includes(job.state)),

  fetchJobs: task(function* (options = {}) {
    const { usePeek } = options;
    if (usePeek) {
      return this.store.peekAll('job');
    } else {
      const allPendingStates = QUEUED_STATES.concat(RUNNING_STATES);
      return yield this.store.query('job', { state: allPendingStates });
    }
  })
});
