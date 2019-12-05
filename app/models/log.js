import ArrayProxy from '@ember/array/proxy';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { gt } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default EmberObject.extend({
  api: service(),
  features: service(),
  auth: service(),
  storage: service(),

  version: 0,
  length: 0,
  hasContent: gt('parts.length', 0),

  parts: computed(() => ArrayProxy.create({
    content: []
  })),

  noRendering: computed(function () {
    return this.storage.getItem('travis.logRendering') === 'false';
  }),

  clearParts() {
    let parts;
    parts = this.parts;
    return parts.set('content', []);
  },


  fetchTask: task(function* () {
    this.debug('log model: fetching log');
    this.clearParts();

    const id = this.get('job.id');
    const url = `/job/${id}/log`;
    const json = yield this.api.get(url).catch(err => { throw 'error'; });

    if (this.noRendering) {
      let text = "Log rendering is off because localStorage['travis.logRendering'] is `false`.";
      this.parts.pushObject({content: `${text}\r\n`, number: 0, final: true});
    } else {
      this.loadParts(json['log_parts']);
    }
    this.set('plainTextUrl', json['@raw_log_href']);
  }),

  clear() {
    this.clearParts();
    return this.runOnClear();
  },

  runOnClear() {
    let callback = this.onClearCallback;
    if (callback) {
      return callback();
    }
  },

  onClear(callback) {
    return this.set('onClearCallback', callback);
  },

  append(part) {
    if (this.parts.isDestroying ||
        this.parts.isDestroyed ||
        this.noRendering) {
      return;
    }
    return this.parts.pushObject(part);
  },

  loadParts(parts) {
    let i, len, part;
    this.debug('log model: load parts');
    for (i = 0, len = parts.length; i < len; i++) {
      part = parts[i];
      this.append(part);
    }
  },

  debug(message) {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log(message);
    }
  }
});
