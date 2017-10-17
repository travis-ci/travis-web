import { isEmpty } from '@ember/utils';
import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service store: null,

  runningJobs: [],

  fetchRunningJobs: task(function* () {
    const runningJobs = this.get('runningJobs');

    if (!isEmpty(runningJobs)) {
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
