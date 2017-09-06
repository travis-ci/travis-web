import { merge } from '@ember/polyfills';
import { isEmpty } from '@ember/utils';
import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

let fetchAll = function (store, type, query) {
  store.query(type, query).then((collection) => {
    let nextPage = collection.get('meta.pagination.next');
    if (nextPage) {
      let { limit, offset } = nextPage;
      fetchAll(store, type, merge(query, { limit, offset }));
    }
  });
};

export default Service.extend({
  @service store: null,

  runningJobs: [],
  queuedJobs: [],

  fetchRunningJobs: task(function* () {
    const runningJobs = this.get('runningJobs');

    if (!isEmpty(runningJobs)) {
      return runningJobs;
    }

    const runningStates = ['started', 'received'];
    const result = yield this.get('store').filter(
      'job',
      null,
      job => runningStates.includes(job.get('state')),
      ['state']
    );

    // we don't run a query in filter above, because we want to get *all*
    // of the running jobs, so if there's more than a page size, we need to
    // paginate
    fetchAll(this.get('store'), 'job', { state: runningStates });

    result.set('isLoaded', true);
    this.set('runningJobs', result);

    return result;
  }),

  fetchQueuedJobs: task(function* () {
    const queuedJobs = this.get('queuedJobs');

    if (!isEmpty(queuedJobs)) {
      return queuedJobs;
    }

    const queuedStates = ['created', 'queued'];
    const result = yield this.get('store').filter(
      'job',
      null,
      job => queuedStates.includes(job.get('state')),
      ['state']
    );

    // we don't run a query in filter above, because we want to get *all*
    // of the queued jobs, so if there's more than a page size, we need to
    // paginate
    fetchAll(this.get('store'), 'job', { state: queuedStates });

    result.set('isLoaded', true);
    this.set('queuedJobs', result);

    return result;
  }),
});
