import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.commit,build.branch',

  buildURL(modelName, id, snapshot, type, query) {
    let url = this._super(...arguments);

    if (type === 'query' && query.repository_id) {
      url = `/repo/${query.repository_id}${url}`;
    }

    return url;
  }
});
