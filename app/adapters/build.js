import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.commit,build.branch',

  pathPrefix(modelName, id, snapshot, type, query) {
    if (type === 'query' && query.repository_id) {
      return `repo/${query.repository_id}`;
    }
  },

  query(store, type, query) {
    if (query.active && query.active === true) {
      const owner = query.owner;
      delete query.owner;
      delete query.active;
      const url = `${this.urlPrefix()}/owner/${owner}/active`;
      return this.ajax(url, 'GET', query);
    }
  }
});
