import Ember from 'ember';
import { service } from 'ember-decorators/service';

export default Ember.Service.extend({
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
      let promise = new Ember.RSVP.Promise((resolve, reject) => {
        this.resolvesByJobId[jobId] = resolve;
      });
      this.promisesByJobId[jobId] = promise;
      Ember.run.once(this, 'flush');
      return promise;
    }
  },

  flush() {
    let resolvesByJobId = this.resolvesByJobId;
    this.promisesByJobId = {};
    this.resolvesByJobId = {};
    let jobIds = Object.keys(resolvesByJobId);
    this.get('ajax').ajax(`/jobs`, 'GET', { data: { ids: jobIds } }).then((data) => {
      data.jobs.forEach((jobData) => {
        resolvesByJobId[jobData.id.toString()](jobData.config);
      });
    });
  }
});

