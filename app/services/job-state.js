import Ember from 'ember';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

export default Ember.Service.extend({
  @service store: null,

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
