import DS from 'ember-data';
import config from 'travis/config/environment';
var Adapter;

Adapter = DS.ActiveModelAdapter.extend({
  auth: Ember.inject.service(),
  host: config.apiEndpoint,
  coalesceFindRequests: true,

  ajaxOptions(url, type, options) {
    var base, hash, token;

    hash = this._super(...arguments);
    hash.headers || (hash.headers = {});
    hash.headers['accept'] = 'application/json; version=2';

    if (token = this.get('auth').token()) {
      (base = hash.headers)['Authorization'] || (base['Authorization'] = "token " + token);
    }

    return hash;
  },

  findMany(store, type, ids) {
    return this.ajax(this.buildURL(type.modelName), 'GET', {
      data: {
        ids: ids
      }
    });
  },

  handleResponse(status, headers, payload) {
    if (status > 299) {
      console.log("[ERROR] API responded with an error (" + status + "): " + (JSON.stringify(payload)));
    }

    return this._super(...arguments);
  }
});

export default Adapter;
