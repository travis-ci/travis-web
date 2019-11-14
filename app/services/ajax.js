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

  needsAuth(method, url) {
    const authUnnecessary = PERMITTED_NON_AUTH_REQUESTS.includes(`${method}:${url}`);
    return !authUnnecessary;
  },

  request(requestUrl, mthd = 'GET', opts = {}) {
    const options = Object.assign({}, defaultOptions, opts);
    const method = mthd.toUpperCase();

    if (method !== 'GET' && method !== 'HEAD') {
      options.contentType = options.contentType || 'application/json; charset=utf-8';
    }

    if (options.data && method !== 'GET' && options.stringifyData !== false && typeof options.data !== 'string') {
      options.data = JSON.stringify(options.data);
    }

    const { endpoint = '' } = options;
    let url = `${endpoint}${requestUrl}`;
    if (options.data) {
      if (method === 'GET' || method === 'HEAD') {
        const params = serializeQueryParams(options.data);
        const delimeter = url.indexOf('?') === -1 ? '?' : '&';
        url = url + delimeter + params;
      } else {
        options.body = options.data;
      }
    }

    const token = get(this, 'auth.token');
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
        if (!response.ok) {
          this.handleFetchError(reject, response);
        } else {
          const { 'content-type': resContentType = '' } = response.headers.map;

          let resContent;
          if (resContentType.includes('application/json')) {
            resContent = response.json();
          } else {
            resContent = response.text();
          }

          resContent
            .then(data => resolve(data))
            .catch(error => this.handleFetchError(reject, error));
        }
      }).catch(error => {
        this.handleFetchError(reject, error);
      });
    });
  },

  handleFetchError(reject, error) {
    reject(error);
    this.logFetchError(error);
  },

  logFetchError(response) {
    if (this.features.get('debugLogging')) {
      const { status = 'UNKNOWN' } = response;
      // eslint-disable-next-line
      console.log(`[ERROR] Fetch error (${status}): ${response}`);
    }
  },
});
