import ArrayProxy from '@ember/array/proxy';
import $ from 'jquery';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { gt } from 'ember-decorators/object/computed';

let Request = EmberObject.extend({
  HEADERS: {
    accept: 'application/json; chunked=true; version=2, text/plain; version=2'
  },

  run() {
    const url = `/jobs/${this.id}/log?cors_hax=true`;
    return this.get('ajax').ajax(url, 'GET', {
      dataType: 'text',
      headers: this.HEADERS,
      success: (body, status, xhr) => {
        run(this, () => this.handle(body, status, xhr));
      }
    });
  },

  handle(body, status, xhr) {
    if (config.featureFlags['pro-version']) {
      this.log.set('token', xhr.getResponseHeader('X-Log-Access-Token'));
    }
    if (xhr.status === 204) {
      return $.ajax({
        url: this.redirectTo(xhr),
        type: 'GET',
        success: (body) => {
          run(this, function () { this.handlers.text(body); });
        }
      });
    } else if (this.isJson(xhr)) {
      return run(this, function () { this.handlers.json(body); });
    } else {
      return run(this, function () { this.handlers.text(body); });
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
    let type = xhr.getResponseHeader('Content-Type') || '';
    return type.indexOf('json') > -1;
  }
});

export default EmberObject.extend({
  @service features: null,

  version: 0,
  isLoaded: false,
  length: 0,
  @gt('parts.length', 0) hasContent: null,

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
    const logUrl = `/jobs/${this.get('job.id')}/log`;
    return this.get('ajax').ajax(logUrl, 'GET', {
      dataType: 'json',
      headers: {
        accept: 'application/json; chunked=true; version=2'
      },
      data: data,
      success: (function (_this) {
        return function (body) {
          return run(_this, function () {
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
          });
        };
      })(this)
    });
  },

  @computed()
  parts() {
    return ArrayProxy.create({
      content: []
    });
  },

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
      json: (function (_this) {
        return function (json) {
          if (json['log']['removed_at']) {
            _this.set('removed', true);
          }
          return _this.loadParts(json['log']['parts']);
        };
      })(this),
      text: (function (_this) {
        return function (text) {
          return _this.loadText(text);
        };
      })(this)
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
    this.set('tttext', text);
    return this.set('isLoaded', true);
  },

  debug(message) {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log(message);
    }
  }
});
