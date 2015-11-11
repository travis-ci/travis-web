import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    _config: {
      key: 'config'
    },
    _finishedAt: {
      key: 'finished_at'
    },
    _startedAt: {
      key: 'started_at'
    },
    _duration: {
      key: 'duration'
    }
  },

  extractRelationships: function(modelClass, resourceHash) {
    var result;
    result = this._super(modelClass, resourceHash);
    return result;
  },

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var result;
    if (payload.commits) {
      payload.builds.forEach(function(build) {
        var commit, commit_id;
        commit_id = build.commit_id;
        if (commit = payload.commits.findBy('id', commit_id)) {
          build.commit = commit;
          return delete build.commit_id;
        }
      });
    }
    result = this._super.apply(this, arguments);
    store = this.store;
    result.data.forEach(function(item) {
      var modelClass, normalized, serializer;
      if (item.relationships && item.relationships.commit) {
        serializer = store.serializerFor('commit');
        modelClass = store.modelFor('commit');
        normalized = serializer.normalize(modelClass, item.relationships.commit.data);
        return result.included.push(normalized.data);
      }
    });
    return result;
  },

  keyForV2Relationship: function(key, typeClass, method) {
    if (key === 'repo') {
      return 'repository_id';
    } else if (key === 'commit') {
      return key;
    } else {
      return this._super.apply(this, arguments);
    }
  },

  normalize: function(modelClass, resourceHash) {
    var data, href, id, repoId, result;

    result = this._super(modelClass, resourceHash);

    data = result.data;

    if (repoId = resourceHash.repository_id) {
      data.attributes.repositoryId = repoId;
    } else if (resourceHash.repository) {
      if (href = resourceHash.repository['@href']) {
        id = href.match(/\d+/)[0];
        data.attributes.repositoryId = id;
      }
    }
    return result;
  }
});

export default Serializer;
