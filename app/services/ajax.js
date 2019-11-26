import { Promise as EmberPromise } from 'rsvp';
import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import serializeQueryParams from 'ember-fetch/utils/serialize-query-params';
import fetch from 'fetch';
import config from 'travis/config/environment';

const PERMITTED_NON_AUTH_REQUESTS = [];
if (config.statusPageStatusUrl) {
  PERMITTED_NON_AUTH_REQUESTS.push(`GET:${config.statusPageStatusUrl}`);
}

const DEFAULT_ACCEPT = 'application/json; version=2';

export default Service.extend({
  auth: service(),
  features: service(),

  getDefaultOptions() {
    return {
      accept: DEFAULT_ACCEPT,
      host: config.apiEndpoint || '',
    };
  },

  needsAuth(method, url) {
    const authUnnecessary = PERMITTED_NON_AUTH_REQUESTS.includes(`${method}:${url}`);
    return !authUnnecessary;
  },

  isRetrieve(method) {
    return method === 'GET' || method === 'HEAD';
  },

  setupHeaders(url, method, options = {}) {
    const { headers = {} } = options;
    const token = get(this, 'auth.token');

    // Release
    if (config.release) {
      headers['X-Client-Release'] = config.release;
    }

    // Auth
    if (token && (this.needsAuth(method, url) || options.forceAuth)) {
      if (!headers['Authorization']) {
        headers['Authorization'] = `token ${token}`;
      }
    }

    // Travis-API-Version
    if (options.travisApiVersion) {
      headers['Travis-API-Version'] = options.travisApiVersion;
    }

    // Content-Type
    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    // Accept
    headers['Accept'] = options.accept || DEFAULT_ACCEPT;

    return headers;
  },

  setupContentType(method, contentType) {
    if (this.isRetrieve(method)) {
      return contentType;
    }
    return contentType || 'application/json; charset=utf-8';
  },

  setupBody(method, options) {
    if (this.isRetrieve(method)) {
      return null;
    }

    const { data, stringifyData } = options;
    if (data && stringifyData !== false && typeof data !== 'string') {
      return JSON.stringify(data);
    }

    return data;
  },

  setupUrl(requestUrl, method, options) {
    const { host = '', data } = options;
    const baseUrl = `${host}${requestUrl}`;

    if (data && this.isRetrieve(method)) {
      const params = serializeQueryParams(data);
      const delimeter = baseUrl.indexOf('?') === -1 ? '?' : '&';
      return `${baseUrl}${delimeter}${params}`;
    }

    return baseUrl;
  },

  request(requestUrl, mthd = 'GET', opts = {}) {
    const defaultOpts = this.getDefaultOptions();
    const options = Object.assign({}, defaultOpts, opts);
    const method = mthd.toUpperCase();

    const url = this.setupUrl(requestUrl, method, options);

    options.contentType = this.setupContentType(method, options.contentType);

    options.body = this.setupBody(method, options);

    options.headers = this.setupHeaders(url, method, options);

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
        this.handleFetchError(reject, {
          isNetworkError: true,
          details: error,
        });
      });
    });
  },

  handleFetchError(reject, error) {
    reject(error);
    this.logFetchError(error);
  },

  logFetchError(response) {
    const { status = 'UNKNOWN' } = response;
    const message = `[ERROR] Fetch error (${status}): ${response}`;
    warn(message, { id: 'travis.ajax.fetch' });
  },
});
