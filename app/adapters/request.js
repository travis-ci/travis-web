import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'request.builds,request.commit',

  buildURL: function (modelName, id, snapshot, requestType, query) {
    let prefix = this.urlPrefix();

    if (requestType === 'query' && query.repository_id) {
      return `${prefix}/repo/${query.repository_id}/requests`;
    } else if (requestType === 'findRecord') {
      let repositoryId = snapshot.belongsTo('build').belongsTo('repo').id;
      return `${prefix}/repo/${repositoryId}/request/${id}`;
    } else {
      throw Error('Message FIXME');
    }
  },

  // This overrides the parent implementation to ignore the query parameters
  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    return this.ajax(url, 'GET', { data: {include: this.includes, skip_count: true }});
  }
});
