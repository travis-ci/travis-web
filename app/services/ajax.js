import { isNone } from '@ember/utils';

import { Promise as EmberPromise } from 'rsvp';
import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import serializeQueryParams from 'ember-fetch/utils/serialize-query-params';
import fetch from 'fetch';
import config from 'travis/config/environment';

const defaultOptions = {
  headers: {
    'Accept': 'application/json; version=2'
  }
};

const PERMITTED_NON_AUTH_REQUESTS = {};
if (config.statusPageStatusUrl) {
  PERMITTED_NON_AUTH_REQUESTS[`GET:${config.statusPageStatusUrl}`] = true;
}

export default Service.extend({
  auth: service(),
  features: service(),

  get(url, options) {
    return this.request(url, 'GET', options);
  },

  post(url, options) {
    return this.request(url, 'POST', options);
  },

  patch(url, options) {
    return this.request(url, 'PATCH', options);
  },

  needsAuth(method, url) {
    const authUnnecessary = PERMITTED_NON_AUTH_REQUESTS[`${method}:${url}`];
    return !authUnnecessary;
  },

  request(requestUrl, mthd, opts) {
    const options = Object.assign({}, defaultOptions, (opts || {}));
    const method = (mthd || 'GET').toUpperCase();
    const { addEndpoint = true } = options;
    const endpoint = !addEndpoint ? '' : config.apiEndpoint || '';
    let url = `${endpoint}${requestUrl}`;
    const token = get(this, 'auth.token');

    options.dataType = options.dataType || 'json';
    options.lib = options.lib || 'xhr';
    options.context = this;

    if (method !== 'GET' && method !== 'HEAD') {
      options.contentType = options.contentType || 'application/json; charset=utf-8';
    }

    if (options.data && method !== 'GET' && options.stringifyData !== false && typeof options.data !== 'string') {
      options.data = JSON.stringify(options.data);
    }

    if (options.data) {
      if (method === 'GET' || method === 'HEAD') {
        const params = serializeQueryParams(options.data);
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';
        url = url + delimeter + params;
      } else {
        options.body = options.data;
      }
    }

    options.headers = options.headers || {};
    if (config.release) {
      options.headers['X-Client-Release'] = config.release;
    }
    if (token && (this.needsAuth(method, url) || options.forceAuth)) {
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = `token ${token}`;
      }
    }
    if (options.contentType) {
      options.headers['Content-Type'] = options.contentType;
    }
    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json';
    }

    const success = options.success || ((() => {}));
    options.success = function (data, status, xhr) {
      return success.call(this, data, status, xhr);
    };

    const error = options.error || (() => {});
    options.error = (data, status, xhr) => {
      if (this.features.get('debugLogging')) {
        // eslint-disable-next-line
        console.log(`[ERROR] API responded with an error (${status}): ${JSON.stringify(data)}`);
      }
      return error.call(this, data, status, xhr);
    };

    if (options.lib === 'fetch') {
      return this.fetch(url, method, options);
    } else {
      return this.xhrFetch(url, method, options);
    }
  },

  xhrFetch(url, method, options) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    if (options.headers) {
      const ref2 = options.headers;
      let name, value;
      for (name in ref2) {
        value = ref2[name];
        xhr.setRequestHeader(name, value);
      }
    }

    let resolve = null;
    let reject = null;
    const promise = new EmberPromise((_resolve, _reject) => {
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
              return JSON.parse(xhr.responseText);
            } catch (error1) {
              if (this.features.get('debugLogging')) {
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

    let data = options.data;
    const contentType = options.contentType;
    const isJSON = isNone(contentType) || contentType.match(/application\/json/);
    if (typeof options.data === 'object' && isJSON) {
      data = JSON.stringify(data);
    }

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }

    return promise;
  },

  fetch(url, method, options) {
    return new EmberPromise((resolve, reject) => {
      const { headers, body } = options;
      const fetchOptions = {
        headers,
        method,
      };
      if (body) {
        fetchOptions['body'] = body;
      }
      fetch(url, fetchOptions).then(response => {
        const { 'content-type': resContentType = '' } = response.headers.map;
        let res;
        if (resContentType.includes('application/json')) {
          res = response.json();
        } else {
          res = response.text();
        }

        if (response.ok) {
          resolve(res);
        } else {
          reject(response);
          this.logFetchError(response);
        }
      }).then(error => {
        reject(error);
        this.logFetchError(error);
      });
    });
  },

  logFetchError(response) {
    if (this.features.get('debugLogging')) {
      const { status = 'UNKNOWN' } = response;
      // eslint-disable-next-line
      console.log(`[ERROR] Fetch error (${status}): ${response}`);
    }
  },
});
