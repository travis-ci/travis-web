import { once } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Service from '@ember/service';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Service.extend({
  @service store: null,

  init() {
    this.toFetch = {};
    return this._super(...arguments);
  },

  fetch(job) {
    if (job._config) {
      return EmberPromise.resolve(job._config);
    }
    if (this.toFetch[job.id]) {
      return this.toFetch[job.id].promise;
    } else {
      let data = this.toFetch[job.id] = { job };
      let promise = new EmberPromise((resolve, reject) => {
        data.resolve = resolve;
      });
      data.promise = promise;
      once(this, 'flush');
      return promise;
    }
  },

  fetchTask: task(function* () {
    for (let jobId in this.toFetch) {
      const { job, resolve } = this.toFetch[jobId];

      if (job._config) {
        resolve(job._config);
      } else {
        const build = yield job.build;
        yield this.store.queryRecord('build', { id: build.id, include: 'build.jobs,job.config' });
        resolve(job._config);
      }
    }
    this.toFetch = {};
  }),

  flush() {
    this.fetchTask.perform();
  }
});

