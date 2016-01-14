import Ember from 'ember';
import config from 'travis/config/environment';
import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
  auth: Ember.inject.service(),
  host: config.apiEndpoint,

  sortQueryParams: false,
  coalesceFindRequests: false,
  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  ajaxOptions: function(url, type, options) {
    var hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    var token;
    if(token = this.get('auth').token()) {
      hash.headers['Authorization'] = "token " + token;
    }

    return hash;
  },

  // TODO: I shouldn't override this method as it's private, a better way would
  // be to create my own URL generator
  _buildURL: function(modelName, id) {
    var url = [];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();
    var path;

    if (modelName) {
      path = this.pathForType(modelName, id);
      if (path) { url.push(path); }
    }

    if (id) { url.push(encodeURIComponent(id)); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    return url;
  },

  pathForType: function(modelName, id) {
    var underscored = Ember.String.underscore(modelName);
    return id ? underscored :  Ember.String.pluralize(underscored);
  }
});
