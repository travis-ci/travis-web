import Ember from 'ember';
import { fetch, Headers } from 'fetch';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { gt } from 'ember-decorators/object/computed';

export default Ember.Object.extend({
  @service features: null,

  version: 0,
  isLoaded: false,
  length: 0,
  @gt('parts.length', 0) hasContent: null,

  @computed()
  parts() {
    return Ember.ArrayProxy.create({
      content: []
    });
  },

  clearParts() {
    let parts;
    parts = this.get('parts');
    return parts.set('content', []);
  },

  fetch() {
    this.debug('log model: fetching log');
    this.clearParts();

    let id = this.get('job.id');
    const url = `${config.apiEndpoint}/job/${id}/log`;

    return fetch(url, {
      headers: new Headers({
        'Travis-API-Version': '3'
      })
    }).then( (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw 'error';
      }
    }).then( (json) => {
      this.loadParts(json['log_parts']);
      this.set('plainTextUrl', json['@raw_url']);
    });
  },

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
    if (this.get('parts').isDestroying || this.get('parts').isDestroyed) {
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
    return this.set('isLoaded', true);
  },

  debug(message) {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log(message);
    }
  }
});
