import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
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

  // FIXME maybe a queryRecord override to remove the query params, like in adapter:user?
});
