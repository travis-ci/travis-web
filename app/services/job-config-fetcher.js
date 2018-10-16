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
    let PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

    if (job._config) {
      return PromiseObject.create({
        promise: EmberPromise.resolve(job._config)
      });
    }
    if (this.toFetch[job.id]) {
      return this.toFetch[job.id].promise;
    } else {
      let data = this.toFetch[job.id] = {};
      let promise = new EmberPromise((resolve, reject) => {
        data.resolve = resolve;
      });
      data.promise = promise;
      once(this, 'flush');
      return PromiseObject.create({ promise });
    }
  },

  flush() {
    Object.keys(this.toFetch).forEach(id => {
      const data = this.toFetch[id];
      this.store.findRecord('job', id).then(job => data.resolve(job._config));
    });
    this.toFetch = {};
  }
});

