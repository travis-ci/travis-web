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
    } else if (resourceHash['@type'] === 'pending') {
      resourceHash = resourceHash.request;
      resourceHash['@type'] = 'request';
      resourceHash.repository['@type'] = 'repository';
    }

    return this._super(modelClass, resourceHash);
  },

  serialize: function (snapshot, options) {
    return {
      branch: snapshot.attr('branchName'),
      sha: snapshot.belongsTo('commit').attr('sha'),
      config: snapshot.attr('config'),
      message: snapshot.attr('message'),
      merge_mode: snapshot.attr('mergeMode')
    };
  }
});

export default Serializer;
