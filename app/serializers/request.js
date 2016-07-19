import V2FallbackSerializer from 'travis/serializers/v2_fallback';

const Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,

  keyForV2Relationship(key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super(...arguments);
    }
  },

  normalizeArrayResponse(store, primaryModelClass, payload/* , id, requestType*/) {
    if (payload.commits) {
      payload.requests.forEach(request => {
        let commit = commit = payload.commits.findBy('id', request.commit_id);
        if (commit) {
          request.commit = commit;
          return delete request.commit_id;
        }
      });
    }
    return this._super(...arguments);
  }
});

export default Serializer;
