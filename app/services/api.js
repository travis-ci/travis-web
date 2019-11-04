import Service, { inject as service } from '@ember/service';
import emberAjaxRequest from 'ember-ajax/request';
import config from 'travis/config/environment';

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
    const { addEndpoint = true } = options;
    const endpoint = !addEndpoint ? '' : config.apiEndpoint || '';
    const requestUrl = `${endpoint}${url}`;


    options.headers = options.headers || {};
    options.headers['Travis-API-Version'] = '3';
    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json';
    }

    options.contentType = 'application/json';

    if (options.data && options.stringifyData !== false) {
      options.data = JSON.stringify(options.data);
    }
    options.method = method;
    // ajax.ajax returns a promise
    // return this.ajax.ajax(url, method, options);
    return emberAjaxRequest(requestUrl, options);
  }
});
