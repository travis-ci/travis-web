import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

export default V2FallbackSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    _config: { key: 'config' },
    _finishedAt: { key: 'finished_at' },
    _startedAt:  { key: 'started_at' }
  },

  keyForV2Relationship(key, typeClass, method) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super(...arguments);
    }
  },

  normalize(modelClass, resourceHash) {
    if (resourceHash.commit) {
      resourceHash.commit['type'] = 'commit';
    }

    return this._super(modelClass, resourceHash);
  },

  normalizeSingleResponse: function(store, primaryModelClass, payload, id, requestType) {
    if (payload.commit) {
      payload.job.commit = payload.commit;
      delete payload.job.commit_id;
    }
    return this._super(...arguments);
  },

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var result;
    if (payload.commits) {
      payload.jobs.forEach(function(job) {
        var commit, commit_id;
        commit_id = job.commit_id;
        if (commit = payload.commits.findBy('id', commit_id)) {
          job.commit = commit;
          return delete job.commit_id;
        }
      });
    }
    return this._super(...arguments);
  },


});
