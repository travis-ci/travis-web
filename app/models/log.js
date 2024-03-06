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
  subscribers: [],

  parts: computed(() => ArrayProxy.create({
    content: []
  })),

  subscribe(parts,caller, cb) {
    this.subscribers.push({parts: parts,caller: caller, cb: cb});
  },

  unsubscribe(parts, cb) {
    this.subscribers = this.subscribers.filter(function(e) { return e.parts !== parts })
  },

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
    const json = yield this.api.get(url).catch(err => { throw err; });

    if (this.noRendering) {
      let text = "Log rendering is off because localStorage['travis.logRendering'] is `false`.";
      this.pushObject({content: `${text}\r\n`, number: 0, final: true});
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

  pushObject(part) {
    let result = this.parts.pushObject(part);
    this.subscribers.forEach(s => {

      if(s.cb) {
        s.cb(s.caller, this.parts.content, this.parts.content.length - 1, this.parts.content.length, 1);
      }
    });

    return result;
  },

  append(part) {
    if (this.parts.isDestroying ||
        this.parts.isDestroyed ||
        this.noRendering) {
      return;
    }

    return this.pushObject(part);
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
