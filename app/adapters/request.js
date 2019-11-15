import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'request.builds,request.commit,request.config,request.raw_configs',

  buildURL: function (modelName, id, snapshot, requestType, query) {
    let prefix = this.urlPrefix();

    if (requestType === 'query' && query.repository_id) {
      return `${prefix}/repo/${query.repository_id}/requests`;
    } else if (requestType === 'findRecord') {
      let build = snapshot.belongsTo('build');

      if (build) {
        let repositoryId = build.belongsTo('repo').id;
        return `${prefix}/repo/${repositoryId}/request/${id}`;
      } else {
        throw Error('Could not load request with an unknown repository');
      }
    } else {
      throw Error('The request adapter only supports findRecord and query with a repository_id.');
    }
  },

  // This overrides the parent implementation to ignore the query parameters
  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    // skip_count is from travis-ci/travis-api#778, a temporary measure because of slow pagination
    return this.ajax(url, 'GET', { data: {include: this.includes, skip_count: true }});
  }
});
