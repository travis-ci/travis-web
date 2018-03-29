import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    if (requestType === 'queryRecord' && query.current === true) {
      let prefix = this.urlPrefix();
      return `${prefix}/user`;
    } else {
      throw new Error(`The user adapter only supports a
        queryRecord request type with a query of current: true`);
    }
  },

  // This overrides the parent implementation to ignore the query parameters
  queryRecord(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'queryRecord', query);
    return this.ajax(url, 'GET');
  }
});
