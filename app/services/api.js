import Service, { inject as service } from '@ember/service';

export const TRAVIS_API_V = {
  TWO: '2',
  THREE: '3',
};
export const TRAVIS_API_VERSIONS = Object.values(TRAVIS_API_V);

export default Service.extend({
  ajax: service(),

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
    if (options.travisApi === undefined) {
      options.travisApi = TRAVIS_API_V.THREE;
    }

    return this.ajax.request(url, method, options);
  }
});
