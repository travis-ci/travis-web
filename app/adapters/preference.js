import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  pathPrefix(modelName, id, snapshot, type, query) {
    let prefix = 'v3';

    // Handle queries for organization settings
    if (type === 'query' && query.organization_id) {
      prefix += `/org/${query.organization_id}`;
      // Remove unnecessary query param from API call
      delete query.organization_id;
    }

    // Handle updates for organization settings
    if (type === 'updateRecord' &&
      (typeof snapshot.adapterOptions) !== 'undefined' &&
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
