import V3Serializer from 'travis/serializers/v3';

var Serializer = V3Serializer.extend({
  isNewSerializerAPI: true,
  // attrs: {
  //   _config: { key: 'config' },
  //   _finishedAt: { key: 'finished_at' },
  //   _startedAt: { key: 'started_at' },
  //   _duration: { key: 'duration' }
  // },

  extractRelationship(relationshipModelName, relationshipHash) {
    if (relationshipModelName === 'repo') {
      relationshipHash['@type'] = 'repo';
    }
    return this._super(...arguments);
  },

  keyForRelationship(key, relationship, method) {
    if(key === 'repo' && relationship === 'belongsTo' && method === 'deserialize') {
      return 'repository';
    } else {
      return this._super(...arguments);
    }
  },

  // normalizeSingleResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
  //   if (payload.commit && payload.build) {
  //     payload.build.commit = payload.commit;
  //     delete payload.build.commit_id;
  //   }
  //   return this._super(...arguments);
  // },

  normalizeArrayResponse: function (store, primaryModelClass, payload/* , id, requestType*/) {
    console.log('normalizeArrayResponse called in build serializer');
    console.log('result of super', this._super(...arguments));
    return this._super(...arguments);
  },
  //   if (payload.commits) {
  //     payload.builds.forEach(function (build) {
  //       let commit = payload.commits.findBy('id', build.commit_id);
  //       if (commit) {
  //         build.commit = commit;
  //         return delete build.commit_id;
  //       }
  //     });
  //   }
  //   return this._super(...arguments);
  // },

  normalize: function (modelClass, resourceHash) {
    // TODO: remove this after switching to V3 entirely
    let type = resourceHash['@type'];
    let commit = resourceHash.commit;
    if (resourceHash['event_type'] == 'pull_request' &&
          !resourceHash.hasOwnProperty('pull_request')) {
      // in V3 we don't return "pull_request" property as we rely on event_type
      // value. This line makes V3 payloads also populate pull_request property
      resourceHash['pull_request'] = true;
    }
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
  },

  // keyForRelationship(key/* , typeClass, method*/) {
  //   if (key === 'repo') {
  //     return 'repository';
  //   } else {
  //     return this._super(...arguments);
  //   }
  // },

  // normalize: function (modelClass, resourceHash) {
  //   // TODO: remove this after switching to V3 entirely
  //   let type = resourceHash['@type'];
  //   let commit = resourceHash.commit;
  //   if (!type && commit && commit.hasOwnProperty('branch_is_default')) {
  //     let build = resourceHash.build,
  //       commit = resourceHash.commit;
  //     let branch = {
  //       name: commit.branch,
  //       default_branch: commit.branch_is_default,
  //       '@href': `/repo/${build.repository_id}/branch/${commit.branch}`
  //     };
  //     resourceHash.build.branch = branch;
  //   }

  //   // fix pusher payload, it doesn't include a branch record:
  //   if (!resourceHash['@type'] && resourceHash.build &&
  //      resourceHash.repository && resourceHash.repository.default_branch) {
  //     let branchName = resourceHash.build.branch,
  //       repository = resourceHash.repository,
  //       defaultBranchName = repository.default_branch.name;

  //     resourceHash.build.branch = {
  //       name: branchName,
  //       default_branch: branchName === defaultBranchName,
  //       '@href': `/repo/${repository.id}/branch/${branchName}`
  //     };

  //     repository.default_branch['@href'] = `/repo/${repository.id}/branch/${defaultBranchName}`;
  //   }

  //   return this._super(modelClass, resourceHash);
  // }
});

export default Serializer;
