import V3Adapter from 'travis/adapters/v3';
import { assert } from '@ember/debug';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    const isQueryingCurrentUser = requestType === 'queryRecord' && query.current === true;
    const isUpdatingCurrentUser = requestType === 'updateRecord' && !id;

    assert('Invalid parameters for /user request', isQueryingCurrentUser || isUpdatingCurrentUser);

    return `${this.urlPrefix()}/user`;
  },

  // This overrides the parent implementation to ignore the query parameters
  queryRecord(store, type, { authToken, ...query }) {
    const url = this.buildURL(type.modelName, null, null, 'queryRecord', query);
    return this.ajax(url, 'GET', { data: { include: query.included }, authToken });
  },

  updateRecord(store, type, snapshot) {
    const serializer = store.serializerFor(type.modelName);
    const data = serializer.serialize(snapshot);
    const url = this.buildURL(type.modelName, null, snapshot, 'updateRecord');
    return this.ajax(url, 'PATCH', { data });
  },

  ajaxOptions(url, type, { authToken, ...options }) {
    const hash = this._super(url, type, options);
    if (authToken) {
      hash.headers = hash.headers || {};
      hash.headers['Authorization'] = `token ${authToken}`;
    }
    return hash;
  }
});
