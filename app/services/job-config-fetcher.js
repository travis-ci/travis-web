import { once } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Service from '@ember/service';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service ajax: null,

  init() {
    this.promisesByJobId = {};
    this.resolvesByJobId = {};
    return this._super(...arguments);
  },

  fetch(jobId) {
    if (this.promisesByJobId[jobId]) {
      return this.promisesByJobId[jobId];
    } else {
      let promise = new EmberPromise((resolve, reject) => {
        this.resolvesByJobId[jobId] = resolve;
      });
      this.promisesByJobId[jobId] = promise;
      once(this, 'flush');
      return promise;
    }
  },

  flush() {
    let resolvesByJobId = this.resolvesByJobId;
    this.promisesByJobId = {};
    this.resolvesByJobId = {};
    let jobIds = Object.keys(resolvesByJobId);
    this.get('ajax').ajax('/jobs', 'GET', { data: { ids: jobIds } }).then((data) => {
      data.jobs.forEach((jobData) => {
        resolvesByJobId[jobData.id.toString()](jobData.config);
      });
    });
  }
});

