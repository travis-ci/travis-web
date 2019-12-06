import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import fetchAll from 'travis/utils/fetch-all';

const FINISHED_STATES = ['failed', 'canceled', 'passed'];
const RUNNING_STATES = ['started', 'received'];
const QUEUED_STATES = ['created', 'queued'];
const RUNNING_AND_FINISHED_STATES = RUNNING_STATES.concat(FINISHED_STATES);

export default Service.extend({
  store: service(),

  jobs: computed(() => []),
  isLoaded: computed(() => false),

  runningJobs: computed('jobs.@each.state', function () {
    const jobs = this.get('jobs');
    let result = jobs.filter(job => RUNNING_AND_FINISHED_STATES.includes(job.state));
    result.set('isLoaded', true);
    return result;
  }),

  queuedJobs: computed('jobs.@each.state', function () {
    const jobs = this.get('jobs');
    let result = jobs.filter(job => QUEUED_STATES.includes(job.state));
    result.set('isLoaded', true);
    return result;
  }),

  fetchJobs: task(function* () {
    if (this.get('isLoaded'))
      return;
    const allPendingStates = QUEUED_STATES.concat(RUNNING_STATES);
    yield fetchAll(this.store, 'job', { state: allPendingStates });
    const jobs = this.store.peekAll('job') || [];
    this.set('jobs', jobs);
    this.get('isLoaded', true);
  }).drop(),

});
