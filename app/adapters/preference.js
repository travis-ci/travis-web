import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  pathPrefix() {
    return 'v3';
  },

  ajax(url, method, ...rest) {
    if (method === 'PUT') method = 'PATCH';
    return this._super(url, method, ...rest);
  }
});
