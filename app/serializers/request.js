import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    branch_name: { key: 'branch' },
    tag_name:    { key: 'tag' }
  },

  keyForV2Relationship: function(key, typeClass, method) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super(...arguments);
    }
  },

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var result;
    if (payload.commits) {
      payload.requests.forEach(function(request) {
        var commit, commit_id;
        commit_id = request.commit_id;
        if (commit = payload.commits.findBy('id', commit_id)) {
          request.commit = commit;
          return delete request.commit_id;
        }
      });
    }
    return this._super(...arguments);
  }
});

export default Serializer;
