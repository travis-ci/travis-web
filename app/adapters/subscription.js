import V3Adapter from 'travis/adapters/v3';
import { InvalidError } from '@ember-data/adapter/error';

export default V3Adapter.extend({
  buildURL(modelName, id, snapshot, requestType) {
    let url = this._super(...arguments);
    if (requestType === 'updateRecord') {
      url = `${url}/address`;
    }
    return url;
  },

  updateRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, { update: true });
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
    return this.ajax(url, 'PATCH', { data });
  },

  handleResponse(status, headers, payload) {
    if (status === 422 && payload.error_message) {
      return new InvalidError([
        {
          'source': { 'pointer': '/data/attributes/validationErrors'},
          'detail': payload.error_message,
        }
      ]);
    }
    return this._super(...arguments);
  }
});
