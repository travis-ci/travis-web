import { Promise as EmberPromise } from 'rsvp';
import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import serializeQueryParams from 'ember-fetch/utils/serialize-query-params';
import fetch from 'fetch';
import config from 'travis/config/environment';

const defaultOptions = {
  dataType: 'json',
  endpoint: config.apiEndpoint || '',
  headers: {
    'Accept': 'application/json; version=2'
  },
};

const PERMITTED_NON_AUTH_REQUESTS = [];
if (config.statusPageStatusUrl) {
  PERMITTED_NON_AUTH_REQUESTS.push(`GET:${config.statusPageStatusUrl}`);
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
    const authUnnecessary = PERMITTED_NON_AUTH_REQUESTS.includes(`${method}:${url}`);
    return !authUnnecessary;
  },

  request(requestUrl, mthd, opts) {
    const options = Object.assign({}, defaultOptions, (opts || {}));
    const method = (mthd || 'GET').toUpperCase();
    const token = get(this, 'auth.token');
    const { endpoint = '' } = options;
    let url = `${endpoint}${requestUrl}`;

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

    return this.fetchRequest(url, method, options);
  },

  fetchRequest(url, method, options) {
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
