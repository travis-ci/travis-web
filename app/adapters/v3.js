import Ember from 'ember';
import config from 'travis/config/environment';
import RESTAdapter from 'ember-data/adapters/rest';

const { service } = Ember.inject;

export default RESTAdapter.extend({
  auth: service(),
  host: config.apiEndpoint,

  sortQueryParams: false,
  coalesceFindRequests: false,
  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  ajaxOptions: function () {
    const hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    let token = this.get('auth').token();
    if (token) {
      hash.headers['Authorization'] = `token ${token}`;
    }

    return hash;
  },

  buildURL: function (modelName, id) {
    let url = [];
    const host = Ember.get(this, 'host');
    const prefix = this.urlPrefix();

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
