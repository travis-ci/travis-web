import Ember from 'ember';
import config from 'travis/config/environment';
import RESTAdapter from 'ember-data/adapters/rest';
import { service } from 'ember-decorators/service';

export default RESTAdapter.extend({
  @service auth: null,

  host: config.apiEndpoint,

  sortQueryParams: false,
  coalesceFindRequests: false,
  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  ajaxOptions: function (url, type, options) {
    options = options || {};
    options.data = options.data || {};

    for (let key in options.data) {
      let value = options.data[key];
      if (Array.isArray(value)) {
        options.data[key] = value.join(',');
      }
    }

    const includes = this.get('includes');
    if (includes) {
      if (options.data.include) {
        options.data.include += `,${includes}`;
      } else {
        options.data.include = includes;
      }
    }

    if (options.data.page_size) {
      options.data.limit = options.data.page_size;
      delete options.data.page_size;
    }

    let hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    let token = this.get('auth').token();
    if (token) {
      hash.headers['Authorization'] = `token ${token}`;
    }

    return hash;
  },

  buildURL: function (modelName, id, snapshot, type, query) {
    let url = [];
    const host = Ember.get(this, 'host');
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
    const underscored = Ember.String.underscore(modelName);
    return id ? underscored :  Ember.String.pluralize(underscored);
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
