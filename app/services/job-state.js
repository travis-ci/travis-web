import Ember from 'ember';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Service.extend({
  @service store: null,
  @service auth: null,

  @alias('auth.currentUser') currentUser: null,

  runningJobs: [],

  fetchRunningJobs: task(function* () {
    const runningJobs = this.get('runningJobs');
    const user = this.get('currentUser');

    if (!Ember.isEmpty(runningJobs)) {
      return runningJobs;
    }

    const runningStates = ['queued', 'started', 'received'];
    const result = yield this.get('store').filter(
      'job',
      {},
      job => runningStates.includes(job.get('state')) && user.hasAccessToRepo(job.get('repo'))
    );

    result.set('isLoaded', true);
    this.set('runningJobs', result);

    return result.get('content');
  }),
});
