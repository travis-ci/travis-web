/* global Log */
import Ember from 'ember';
import config from 'travis/config/environment';

const Request = Ember.Object.extend({
  HEADERS: {
    accept: 'application/json; chunked=true; version=2, text/plain; version=2'
  },

  run() {
    return this.get('ajax').ajax(`/jobs/${this.id}/log?cors_hax=true`, 'GET', {
      dataType: 'text',
      headers: this.HEADERS,
      success: (body, status, xhr) => {
        Ember.run(this, function () {
          return this.handle(body, status, xhr);
        });
      }
    });
  },

  handle(body, status, xhr) {
    if (config.pro) {
      this.log.set('token', xhr.getResponseHeader('X-Log-Access-Token'));
    }
    if (xhr.status === 204) {
      return Ember.$.ajax({
        url: this.redirectTo(xhr),
        type: 'GET',
        success: (body) => {
          Ember.run(this, function () { this.handlers.text(body); });
        }
      });
    } else if (this.isJson(xhr)) {
      return Ember.run(this, function () { this.handlers.json(body); });
    } else {
      return Ember.run(this, function () { this.handlers.text(body); });
    }
  },

  redirectTo(xhr) {
    // Firefox can't see the Location header on the xhr response due to the wrong
    // status code 204. Should be some redirect code but that doesn't work with CORS.
    return xhr.getResponseHeader('Location');
  },

  isJson(xhr) {
    // Firefox can't see the Content-Type header on the xhr response due to the wrong
    // status code 204. Should be some redirect code but that doesn't work with CORS.
    const type = xhr.getResponseHeader('Content-Type') || '';
    return type.indexOf('json') > -1;
  }
});

const LogModel = Ember.Object.extend({
  version: 0,
  isLoaded: false,
  length: 0,
  hasContent: Ember.computed.gt('parts.length', 0),

  fetchMissingParts(partNumbers, after) {
    let data;
    if (this.get('notStarted')) {
      return;
    }
    data = {};
    if (partNumbers) {
      data['part_numbers'] = partNumbers;
    }
    if (after) {
      data['after'] = after;
    }
    return this.get('ajax').ajax(`/jobs/${this.get('job.id')}/log`, 'GET', {
      dataType: 'json',
      headers: {
        accept: 'application/json; chunked=true; version=2'
      },
      data,
      success: ((_this => body => Ember.run(_this, function () {
        let i, len, part, results;
        let { parts } = body.log;
        if (parts) {
          results = [];
          for (i = 0, len = parts.length; i < len; i++) {
            part = parts[i];
            results.push(this.append(part));
          }
          return results;
        }
      })))(this)
    });
  },

  parts: Ember.computed(() => Ember.ArrayProxy.create({
    content: []
  })),

  clearParts() {
    let parts;
    parts = this.get('parts');
    return parts.set('content', []);
  },

  fetch() {
    let handlers;
    this.debug('log model: fetching log');
    this.clearParts();
    handlers = {
      json: ((_this => json => {
        if (json['log']['removed_at']) {
          _this.set('removed', true);
        }
        return _this.loadParts(json['log']['parts']);
      }))(this),
      text: ((_this => text => _this.loadText(text)))(this)
    };
    let id = this.get('job.id');
    if (id) {
      return Request.create({
        id,
        handlers,
        log: this,
        ajax: this.get('ajax')
      }).run();
    }
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

  loadText(text) {
    this.debug('log model: load text');
    this.append({
      number: 1,
      content: text,
      final: true
    });
    return this.set('isLoaded', true);
  },

  debug(message) {
    if (Log.DEBUG) {
      // eslint-disable-next-line
      console.log(message);
    }
  }
});

export default LogModel;
