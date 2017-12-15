import { once } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Service from '@ember/service';
import { service } from 'ember-decorators/service';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';

export default Service.extend({
  @service store: null,

  init() {
    this.toFetch = {};
    return this._super(...arguments);
  },

  fetch(job) {
    if (job.get('_config')) {
      return EmberPromise.resolve(job.get('_config'));
    }
    let jobId = job.get('id');
    if (this.toFetch[jobId]) {
      return this.toFetch[jobId].promise;
    } else {
      let data = this.toFetch[jobId] = { job };
      let promise = new EmberPromise((resolve, reject) => {
        data.resolve = resolve;
      });
      data.promise = promise;
      once(this, 'flush');

      let PromiseObject = ObjectProxy.extend(PromiseProxyMixin);
      return PromiseObject.create({ promise });
    }
  },

  flush() {
    let toFetch = this.toFetch;
    this.toFetch = {};
    let buildIds = new Set();
    Object.values(toFetch).forEach(data => buildIds.add(data.job.get('build.id')));

    buildIds.forEach(id => {
      let queryParams = { id, include: 'job.config,build.jobs' };
      this.get('store').queryRecord('build', queryParams).then(build => {
        build.get('jobs').forEach(job => {
          let data = toFetch[job.get('id')];
          if (data) {
            data.resolve(job.get('_config'));
          }
        });
      });
    });
  }
});

