import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Service.extend({
  store: service(),

  finishedStates: ['failed', 'canceled', 'passed'],
  runningStates: ['started', 'received'],
  queuedStates: ['created', 'queued'],
  runningAndFinishedStates: computed(function () {
    return this.runningStates.concat(this.finishedStates);
  }),

  jobs: [],

  runningJobs: computed('jobs.@each.state', function () {
    const jobs = this.get('jobs');
    let result = jobs.filter(job => this.runningAndFinishedStates.includes(job.state));
    result.set('isLoaded', true);
    return result;
  }),

  queuedJobs: computed('jobs.@each.state', function () {
    const jobs = this.get('jobs');
    let result = jobs.filter(job => this.queuedStates.includes(job.state));
    result.set('isLoaded', true);
    return result;
  }),

  reloadJobs: task(function* () {
    const jobs = yield this.store.peekAll('job') || [];
    this.set('jobs', jobs);
  }).keepLatest(),

  fetchJobs: task(function* () {
    const jobs = this.jobs;
    if (!isEmpty(jobs)) {
      return jobs;
    }

    const allStates = this.queuedStates.concat(this.runningStates);
    let result = yield this.store.filter(
      'job',
      job => allStates.includes(job.get('state'))
    );

    this.set('jobs', result);
    return result;
  }).keepLatest(),

});
