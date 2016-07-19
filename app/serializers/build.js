import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    _config: { key: 'config' },
    _finishedAt: { key: 'finished_at' },
    _startedAt: { key: 'started_at' },
    _duration: { key: 'duration' }
  },

  extractRelationships: function (modelClass, resourceHash) {
    return this._super(modelClass, resourceHash);
  },

  normalizeSingleResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
    if (payload.commit) {
      payload.build.commit = payload.commit;
      delete payload.build.commit_id;
    }
    return this._super(...arguments);
  },

  normalizeArrayResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
    if (payload.commits) {
      payload.builds.forEach(function (build) {
        let commit = payload.commits.findBy('id', build.commit_id);
        if (commit) {
          build.commit = commit;
          return delete build.commit_id;
        }
      });
    }
    return this._super(...arguments);
  },

  keyForV2Relationship: function (key/* , typeClass, method*/) {
    if (key === 'jobs') {
      return 'job_ids';
    } else if (key === 'repo') {
      return 'repository_id';
    } else if (key === 'commit') {
      return key;
    } else {
      return this._super(...arguments);
    }
  },

  keyForRelationship(key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository';
    } else {
      return this._super(...arguments);
    }
  },

  normalize: function (modelClass, resourceHash) {
    // TODO: remove this after switching to V3 entirely
    let type = resourceHash['@type'];
    let commit = resourceHash.commit;
    if (!type && commit && commit.hasOwnProperty('branch_is_default')) {
      let build = resourceHash.build,
        commit = resourceHash.commit;
      let branch = {
        name: commit.branch,
        default_branch: commit.branch_is_default,
        '@href': `/repo/${build.repository_id}/branch/${commit.branch}`
      };
      resourceHash.build.branch = branch;
    }

    // fix pusher payload, it doesn't include a branch record:
    if (!resourceHash['@type'] && resourceHash.build &&
       resourceHash.repository && resourceHash.repository.default_branch) {
      let branchName = resourceHash.build.branch,
        repository = resourceHash.repository,
        defaultBranchName = repository.default_branch.name;

      resourceHash.build.branch = {
        name: branchName,
        default_branch: branchName === defaultBranchName,
        '@href': `/repo/${repository.id}/branch/${branchName}`
      };

      repository.default_branch['@href'] = `/repo/${repository.id}/branch/${defaultBranchName}`;
    }

    return this._super(modelClass, resourceHash);
  }
});

export default Serializer;
