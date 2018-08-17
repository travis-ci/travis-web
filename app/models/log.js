import ArrayProxy from '@ember/array/proxy';
import EmberObject from '@ember/object';
import { fetch, Headers } from 'fetch';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { gt } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default EmberObject.extend({
  @service features: null,
  @service auth: null,
  @service storage: null,

  version: 0,
  length: 0,
  @gt('parts.length', 0) hasContent: null,

  @computed()
  parts() {
    return ArrayProxy.create({
      content: []
    });
  },

  @computed()
  noRendering() {
    return this.get('storage').getItem('travis.logRendering') === 'false';
  },

  clearParts() {
    let parts;
    parts = this.get('parts');
    return parts.set('content', []);
  },


  fetchTask: task(function* () {
    this.debug('log model: fetching log');
    this.clearParts();

    let id = this.get('job.id');

    const url = `${config.apiEndpoint}/job/${id}/log`;
    const token = this.get('auth.token');
    let headers = {
      'Travis-API-Version': '3'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // TODO: I'd like to clean API access to use fetch everywhere once we fully
    //       switch to API V3
    const response = yield fetch(url, {
      headers: new Headers(headers)
    });
    let json;
    if (response.ok) {
      json = yield response.json();
    } else {
      throw 'error';
    }

    if (this.get('noRendering')) {
      let text = "Log rendering is off because localStorage['travis.logRendering'] is `false`.";
      this.get('parts').pushObject({content: `${text}\r\n`, number: 0, final: true});
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
    let callback = this.get('onClearCallback');
    if (callback) {
      return callback();
    }
  },

  onClear(callback) {
    return this.set('onClearCallback', callback);
  },

  append(part) {
    if (this.get('parts').isDestroying ||
        this.get('parts').isDestroyed ||
        this.get('noRendering')) {
      return;
    }
    return this.get('parts').pushObject(part);
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
