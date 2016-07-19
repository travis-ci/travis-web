/* global jQuery */
import Ember from 'ember';
import config from 'travis/config/environment';
var defaultOptions;

jQuery.support.cors = true;

defaultOptions = {
  accepts: {
    json: 'application/json; version=2'
  }
};

const { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),

  get(url, callback, errorCallback) {
    return this.ajax(url, 'get', {
      success: callback,
      error: errorCallback
    });
  },

  post(url, data, callback) {
    return this.ajax(url, 'post', {
      data: data,
      success: callback
    });
  },

  patch(url, data, callback) {
    return this.ajax(url, 'patch', {
      data: data,
      success: callback
    });
  },

  needsAuth() {
    return true;
  },

  ajax(url, method, options) {
    var accepts, data, delimeter, endpoint, error, key, name, params,
      promise, ref, ref1, ref2, reject, resolve, success, token, value, xhr;
    method = (method || 'GET').toUpperCase();
    endpoint = config.apiEndpoint || '';
    options = options || {};
    token = Ember.get(this, 'auth').token();
    if (token && (this.needsAuth(method, url) || options.forceAuth)) {
      options.headers = options.headers || {};
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = 'token ' + token;
      }
    }
    options.url = url = '' + endpoint + url;
    options.type = method;
    options.dataType = options.dataType || 'json';
    options.context = this;
    if (options.data && method !== 'GET') {
      options.data = JSON.stringify(options.data);
    }
    if (method !== 'GET' && method !== 'HEAD') {
      options.contentType = options.contentType || 'application/json; charset=utf-8';
    }
    success = options.success || (function () {});
    options.success = function (data, status, xhr) {
      return success.call(this, data, status, xhr);
    };
    error = options.error || function () {};
    options.error = (data, status, xhr) => {
      //eslint-disable-next-line
      console.log("[ERROR] API responded with an error (" + status + "): " + (JSON.stringify(data)));
      return error.call(this, data, status, xhr);
    };

    options = Ember.$.extend(options, defaultOptions);

    if (options.data && (method === 'GET' || method === 'HEAD')) {
      params = jQuery.param(options.data);
      delimeter = url.indexOf('?') === -1 ? '?' : '&';
      url = url + delimeter + params;
    }
    xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (options.accepts && (((ref = options.headers) != null ? ref.accept : void 0) == null)) {
      accepts = [];
      ref1 = options.accepts;
      for (key in ref1) {
        value = ref1[key];
        accepts.pushObject(value);
      }
      xhr.setRequestHeader('Accept', accepts.join(', '));
    }
    if (options.headers) {
      ref2 = options.headers;
      for (name in ref2) {
        value = ref2[name];
        xhr.setRequestHeader(name, value);
      }
    }
    if (options.contentType) {
      xhr.setRequestHeader('Content-Type', options.contentType);
    }
    resolve = null;
    reject = null;
    promise = new Ember.RSVP.Promise(function (_resolve, _reject) {
      resolve = _resolve;
      return reject = _reject;
    });
    xhr.onreadystatechange = function () {
      var contentType, data;
      if (xhr.readyState === 4) {
        contentType = xhr.getResponseHeader('Content-Type');
        data = (function () {
          if (contentType && contentType.match(/application\/json/)) {
            try {
              return jQuery.parseJSON(xhr.responseText);
            } catch (error1) {
              // eslint-disable-next-line
              return console.log('error while parsing a response', method, options.url, xhr.responseText);
            }
          } else {
            return xhr.responseText;
          }
        })();
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
          return options.success.call(options.context, data, xhr.status, xhr);
        } else {
          reject(xhr);
          return options.error.call(options.context, data, xhr.status, xhr);
        }
      }
    };
    data = options.data;
    let contentType = options.contentType;
    let isJSON = Ember.isNone(contentType) || contentType.match(/application\/json/);
    if (typeof options.data === 'object' && isJSON) {
      data = JSON.stringify(data);
    }
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
    return promise;
  }
});
