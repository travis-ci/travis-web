import V2FallbackSerializer from 'travis/serializers/v2_fallback';

let Serializer = V2FallbackSerializer.extend({

  keyForV2Relationship: function (key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super(...arguments);
    }
  },

  normalizeArrayResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
    if (payload.commits) {
      payload.requests.forEach((request) => {
        let commit = commit = payload.commits.findBy('id', request.commit_id);
        if (commit) {
          request.commit = commit;
          return delete request.commit_id;
        }
      });
    }
    return this._super(...arguments);
  },

  normalize: function (modelClass, resourceHash) {
    // This converts this from hasMany to belongsTo
    if (resourceHash.builds) {
      resourceHash.build = resourceHash.builds[0];
    }

    return this._super(modelClass, resourceHash);
  }
});

export default Serializer;
