import $ from 'jquery';
import Service from '@ember/service';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';

export default Service.extend({
  @service auth: null,
  @service features: null,

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
    let endpoint = config.apiEndpoint || '';
    let token = this.get('auth').token();

    options.headers = options.headers || {};
    options.headers['Travis-API-Version'] = '3';
    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json';
    }

    if (token) {
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = `token ${token}`;
      }
    }
    options.url = url = `${endpoint}${url}`;
    options.method = method;
    options.dataType = options.dataType || 'json';
    options.contentType = 'application/json';

    if (options.data) {
      options.data = JSON.stringify(options.data);
    }

    return new EmberPromise((resolve, reject) => {
      options.error = (jqXHR, textStatus, errorThrown) => {
        if (this.get('features.debugLogging')) {
          // eslint-disable-next-line
          console.log(`[ERROR] API responded with an error (${status}): ${JSON.stringify(data)}`);
        }
        run(() => {
          // TODO: in the future we might want to run some handler here
          // that would process all args
          reject(jqXHR);
        });
      };

      options.success = (payload, textStatus, jqXHR) => {
        run(() => {
          resolve(payload);
        });
      };

      $.ajax(url, options);
    });
  }
});
