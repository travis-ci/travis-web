import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    if (requestType === 'queryRecord' && query.login !== undefined) {
      const prefix = this.urlPrefix();
      const { login } = query;
      return `${prefix}/owner/${login}`;
    } else {
      throw new Error(`The owner adapter only supports a
        queryRecord request type with a query of login`);
    }
  },
});
