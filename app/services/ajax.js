import Service, { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import serializeQueryParams from 'ember-fetch/utils/serialize-query-params';
import fetch from 'fetch';

const DEFAULT_ACCEPT = 'application/json; version=2';

export default Service.extend({
  features: service(),

  getDefaultOptions() {
    return {
      accept: DEFAULT_ACCEPT,
    };
  },

  isRetrieve(method) {
    return method === 'GET' || method === 'HEAD';
  },

  setupHeaders(method, options = {}) {
    const { headers = {} } = options;

    // Content-Type
    if (!this.isRetrieve(method)) {
      headers['Content-Type'] = options.contentType || 'application/json; charset=utf-8';
    }

    // Accept
    headers['Accept'] = options.accept || DEFAULT_ACCEPT;

    return headers;
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

    options.body = this.setupBody(method, options);

    options.headers = this.setupHeaders(method, options);

    return this.fetchRequest(url, method, options);
  },

  fetchRequest(url, method, { headers, body }) {
    const fetchOptions = {
      headers,
      method,
    };

    if (body) {
      fetchOptions.body = body;
    }

    return fetch(url, fetchOptions)
      .then(response => {
        if (response.ok) {
          return isJsonResponse(response) ? response.json() : response.text();
        } else {
          this.handleFetchError(response);
        }
      })
      .catch(error => {
        this.handleFetchError({
          isNetworkError: true,
          details: error,
        });
      });
  },

  handleFetchError(error) {
    this.logFetchError(error);
  },

  logFetchError(response) {
    const { status = 'UNKNOWN' } = response;
    const message = `[ERROR] Fetch error (${status}): ${JSON.stringify(response)}`;
    warn(message, { id: 'travis.ajax.fetch' });
  },
});

function isJsonResponse(response) {
  return response.headers.get('content-type').includes('application/json');
}
