import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Service.extend({
  ajax: service(),
  auth: service(),

  get(url, options = {}) {
    return this.request(url, 'GET', options);
  },

  post(url, options = {}) {
    return this.request(url, 'POST', options);
  },

  patch(url, options = {}) {
    return this.request(url, 'PATCH', options);
  },

  put(url, options = {}) {
    return this.request(url, 'PUT', options);
  },

  delete(url, options = {}) {
    return this.request(url, 'DELETE', options);
  },

  request(url, method = 'GET', options = {}) {
    options.host = config.apiEndpoint || '';

    options.headers = this.setupHeaders(options);

    return this.ajax.request(url, method, options);
  },


  setupHeaders(options = {}) {
    const { headers = {} } = options;
    const { webToken } = this.auth;

    // Release
    if (config.release) {
      headers['X-Client-Release'] = config.release;
    }

    // Authorization
    if (webToken) {
      headers['Authorization'] = `token ${webToken}`;
    }

    // Travis-API-Version
    if (options.travisApiVersion !== null) {
      headers['Travis-API-Version'] = options.travisApiVersion || '3';
    }

    return headers;
  },
});
