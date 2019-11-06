import Service, { inject as service } from '@ember/service';

export default Service.extend({
  ajax: service(),
  auth: service(),
  features: service(),

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
    options.addEndpoint = true;
    options.headers = options.headers || {};
    options.headers['Travis-API-Version'] = '3';
    options.headers['Accept'] = 'application/json';
    options.lib = 'fetch';

    // ajax.ajax returns a promise
    return this.ajax.ajax(url, method, options);
  }
});
