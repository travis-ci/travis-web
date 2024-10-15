import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';
import config from 'travis/config/environment';
import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default RESTAdapter.extend({
  auth: service(),

  host: config.apiEndpoint,

  sortQueryParams: false,
  coalesceFindRequests: false,
  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Client-Release': config.release
  },

  ajaxOptions: function (url, type = 'GET', options) {
    options = options || {};
    options.data = options.data || {};
    options.data = Object.assign({}, options.data); // clone

    for (let key in options.data) {
      let value = options.data[key];
      if (Array.isArray(value)) {
        options.data[key] = value.join(',');
      }
    }

    const includes = this.includes;
    if (includes) {
      if (options.data.include) {
        options.data.include += `,${includes}`;
      } else {
        options.data.include = includes;
      }
    }

    if (options.data.noInclude) {
      delete options.data.include;
      delete options.data.noInclude;
    }

    if (options.data.page_size) {
      options.data.limit = options.data.page_size;
      delete options.data.page_size;
    }

    let hash = this._super(url, type, options);

    hash.headers = hash.headers || {};

    let token = this.get('auth.webToken');
    console.log('webToken called from V3:', token);
    if (token) {
      hash.headers['Authorization'] = `token ${token}`;
    }

    return hash;
  },

  buildURL: function (modelName, id, snapshot, requestType, query) {
    let url = [];
    const host = this.host;
    const prefix = this.urlPrefix();
    const pathPrefix = this.pathPrefix(...arguments);

    if (pathPrefix) {
      url.push(pathPrefix);
    }

    if (modelName) {
      const path = this.pathForType(modelName, id);
      if (path) { url.push(path); }
    }

    if (id) { url.push(encodeURIComponent(id)); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = `/${url}`;
    }

    return url;
  },

  pathPrefix() {},

  pathForType: function (modelName, id) {
    const underscored = underscore(modelName);
    return id ? underscored : pluralize(underscored);
  },

  // Get the host alone, without a path
  getHost() {
    let match = this.host.match(/(https?:\/\/)?([^\/]+)/);

    if (match) {
      return match[0];
    } else {
      return config.apiEndpoint;
    }
  }
});
