import V2FallbackSerializer from "travis/src/data/models/v2_fallback/serializer";

var Serializer = V2FallbackSerializer.extend({

  keyForV2Relationship: function (key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super(...arguments);
    }
  },

  normalizeArrayResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
    if (payload.commits) {
      payload.requests.forEach(function (request) {
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
