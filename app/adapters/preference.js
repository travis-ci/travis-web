import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  pathPrefix(modelName, id, snapshot, type, query) {
    let prefix = 'v3';

    if (type === 'query' && query.organization_id) {
      prefix += `/org/${query.organization_id}`;
      // Remove unnecessary query param from API call
      delete query.organization_id;
    }

    if (type === 'updateRecord' &&
      snapshot !== null &&
      snapshot.hasOwnProperty('adapterOptions') &&
      snapshot.adapterOptions.hasOwnProperty('organization_id')
    ) {
      prefix += `/org/${snapshot.adapterOptions.organization_id}`;
    }

    return prefix;
  },

  ajax(url, method, ...rest) {
    if (method === 'PUT') method = 'PATCH';
    return this._super(url, method, ...rest);
  }
});
