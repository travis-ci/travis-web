/* global jQuery */
import { isNone } from '@ember/utils';

import { Promise as EmberPromise } from 'rsvp';
import $ from 'jquery';
import { get } from '@ember/object';
import Service from '@ember/service';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

jQuery.support.cors = true;

let defaultOptions = {
  accepts: {
    json: 'application/json; version=2'
  }
};

export default Service.extend({
  @service auth: null,
  @service features: null,

  get(url, callback, errorCallback) {
    return this.ajax(url, 'get', {
      success: callback,
      error: errorCallback
    });
  },

  getV3(url, callback, errorCallback) {
    return this.ajax(url, 'get', {
      success: callback,
      error: errorCallback,
      headers: {
        'Travis-API-Version': '3'
      }
    });
  },

  post(url, data, callback) {
    return this.ajax(url, 'post', {
      data,
      success: callback
    });
  },

  postV3(url, data, callback) {
    return this.ajax(url, 'post', {
      data: data,
      success: callback,
      headers: {
        'Travis-API-Version': '3'
      }
    });
  },

  patch(url, data, callback) {
    return this.ajax(url, 'patch', {
      data,
      success: callback
    });
  },

  needsAuth() {
    return true;
  },

  ajax(url, method, options) {
    let accepts, data, delimeter, endpoint, error, key, name, params,
      promise, ref, ref1, ref2, reject, resolve, success, token, value, xhr;
    method = (method || 'GET').toUpperCase();
    endpoint = config.apiEndpoint || '';
    options = options || {};
    token = get(this, 'auth.token');

    options.headers = options.headers || {};

    if (token && (this.needsAuth(method, url) || options.forceAuth)) {
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = `token ${token}`;
      }
    }

    options.headers['X-Client-Release'] = config.release;
    options.url = url = `${endpoint}${url}`;
    options.type = method;
    options.dataType = options.dataType || 'json';
    options.context = this;
    if (options.data && method !== 'GET') {
      options.data = JSON.stringify(options.data);
    }
    if (method !== 'GET' && method !== 'HEAD') {
      options.contentType = options.contentType || 'application/json; charset=utf-8';
    }
    success = options.success || ((() => {}));
    options.success = function (data, status, xhr) {
      return success.call(this, data, status, xhr);
    };
    error = options.error || (() => {});
    options.error = (data, status, xhr) => {
      if (get(this, 'features').get('debugLogging')) {
        // eslint-disable-next-line
        console.log(`[ERROR] API responded with an error (${status}): ${JSON.stringify(data)}`);
      }
      return error.call(this, data, status, xhr);
    };

    options = $.extend(options, defaultOptions);

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
    promise = new EmberPromise((_resolve, _reject) => {
      resolve = _resolve;
      return reject = _reject;
    });
    xhr.onreadystatechange = () => {
      let contentType, data;
      if (xhr.readyState === 4) {
        contentType = xhr.getResponseHeader('Content-Type');
        data = (() => {
          if (contentType && contentType.match(/application\/json/)) {
            try {
              return jQuery.parseJSON(xhr.responseText);
            } catch (error1) {
              if (get(this, 'features').get('debugLogging')) {
                // eslint-disable-next-line
                console.log('error while parsing a response', method, options.url, xhr.responseText);
              }
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
    let isJSON = isNone(contentType) || contentType.match(/application\/json/);
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
