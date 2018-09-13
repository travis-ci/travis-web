import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.commit,build.branch,build.request,build.repository',

  pathPrefix(modelName, id, snapshot, type, query) {
    if (type === 'query' && query.repository_id) {
      return `repo/${query.repository_id}`;
    }
  },

  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType == 'queryRecord' && query.id) {
      let id = query.id;
      delete query.id;
      return this._super(modelName, id, snapshot, 'findRecord', query);
    } else {
      // This tells the API to skip page count for pagination, speeding up queries.
      if (query) {
        query.skip_count = true;
      }
      return this._super(...arguments);
    }
  }
});
