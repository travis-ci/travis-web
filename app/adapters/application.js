import config from 'travis/config/environment';
import ActiveModelAdapter from 'active-model-adapter';
import { service } from 'ember-decorators/service';

export default ActiveModelAdapter.extend({
  @service auth: null,

  host: config.apiEndpoint,
  coalesceFindRequests: true,

  // Before Ember Data 2.0 the default behaviour of running `findAll` was to get
  // new records only when there're no records in the store. This will change
  // to a different strategy in 2.0: when you run `findAll` it will not get any
  // new data initially, but it will try loading new data in the background.
  //
  // I'm disabling the new behaviour for now.
  shouldBackgroundReloadRecord() {
    return false;
  },

  ajaxOptions() {
    let hash = this._super(...arguments);
    hash.headers = hash.headers || {};
    hash.headers['accept'] = 'application/json; version=2';
    hash.headers['X-Client-Release'] = config.release;

    let token = this.get('auth').token();
    if (token) {
      if (!hash.headers['Authorization']) {
        hash.headers['Authorization'] = `token ${token}`;
      }
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
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log("[ERROR] API responded with an error (" + status + "): " + (JSON.stringify(payload)));
      }
    }

    return this._super(...arguments);
  },
});
