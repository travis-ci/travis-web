import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  pathPrefix(modelName, id, snapshot, type, query) {
    let prefix = 'v3';

    if (type === 'query' && query.organization_id) {
      prefix += `/org/${query.organization_id}`;
    }

    return prefix;
  },

  ajax(url, method, ...rest) {
    if (method === 'PUT') method = 'PATCH';
    return this._super(url, method, ...rest);
  }
});
