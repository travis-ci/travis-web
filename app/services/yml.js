import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Service.extend({
  ajax: service(),

  validate(config) {
    return this.request('/parse', 'POST', { data: this.body(config) });
  },

  request(url, method = 'GET', options = {}) {
    options.host = config.ymlEndpoint || 'https://yml-staging.travis-ci.org'; // TODO
    options.headers = this.headers(options);
    return this.ajax.request(url, method, options);
  },

  body(config) {
    return config;
  },

  headers(options = {}) {
    const { headers = {} } = options;
    headers['Authorization'] = 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'; // TODO
    headers['Content-Type'] = 'text/plain;charset=UTF-8';
    return headers;
  },
});
