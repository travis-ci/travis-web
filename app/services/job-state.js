import Ember from 'ember';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Service.extend({
  store: service(),

  runningJobs: [],

  fetchRunningJobs: task(function* () {
    const runningJobs = this.get('runningJobs');

    if (!Ember.isEmpty(runningJobs)) {
      return runningJobs;
    }

    const runningStates = ['queued', 'started', 'received'];
    const result = yield this.get('store').filter(
      'job',
      {},
      job => runningStates.includes(job.get('state'))
    );

    result.set('isLoaded', true);
    this.set('runningJobs', result);

    return result.get('content');
  }),
});
