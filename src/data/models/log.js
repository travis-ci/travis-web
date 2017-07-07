import Ember from 'ember';
import config from 'travis/config/environment';

var Request = Ember.Object.extend({
  HEADERS: {
    accept: 'application/json; chunked=true; version=2, text/plain; version=2'
  },

  run() {
    return this.get('ajax').ajax('/jobs/' + this.id + '/log?cors_hax=true', 'GET', {
      dataType: 'text',
      headers: this.HEADERS,
      success: (body, status, xhr) => {
        return Ember.run(this, function () {
          return this.handle(body, status, xhr);
        });
      }
    });
  },

  handle(body, status, xhr) {
    if (config.featureFlags['pro-version']) {
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
    var type = xhr.getResponseHeader('Content-Type') || '';
    return type.indexOf('json') > -1;
  }
});

const { service } = Ember.inject;

var LogModel = Ember.Object.extend({
  features: service(),

  version: 0,
  isLoaded: false,
  length: 0,
  hasContent: Ember.computed.gt('parts.length', 0),

  fetchMissingParts(partNumbers, after) {
    var data;
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
    return this.get('ajax').ajax('/jobs/' + (this.get('job.id')) + '/log', 'GET', {
      dataType: 'json',
      headers: {
        accept: 'application/json; chunked=true; version=2'
      },
      data: data,
      success: (function (_this) {
        return function (body) {
          return Ember.run(_this, function () {
            var i, len, part, results;
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

  parts: Ember.computed(function () {
    return Ember.ArrayProxy.create({
      content: []
    });
  }),

  clearParts() {
    var parts;
    parts = this.get('parts');
    return parts.set('content', []);
  },

  fetch() {
    var handlers;
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
    var i, len, part;
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
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log(message);
    }
  }
});

export default LogModel;
