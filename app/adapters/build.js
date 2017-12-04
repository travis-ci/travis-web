import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.commit,build.branch',

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
      return this._super(...arguments);
    }
  }
});
