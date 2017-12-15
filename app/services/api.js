/* global jQuery */
import { isNone } from '@ember/utils';

import { Promise as EmberPromise } from 'rsvp';
import $ from 'jquery';
import { get } from '@ember/object';
import Service from '@ember/service';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

jQuery.support.cors = true;

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

    if (token) {
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = `token ${token}`;
      }
    }
    options.url = url = `${endpoint}${url}`;
    options.method = method;
    options.dataType = options.dataType || 'json';
    let errorCallback = options.error || (() => {});
    options.error = (data, status, xhr) => {
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log(`[ERROR] API responded with an error (${status}): ${JSON.stringify(data)}`);
      }
      return errorCallback.call(this, data, status, xhr);
    };

    return jQuery.ajax(url, options);
  }
});
