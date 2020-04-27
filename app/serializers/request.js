import V2FallbackSerializer from 'travis/serializers/v2_fallback';

export default V2FallbackSerializer.extend({
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

    if (resourceHash.raw_configs) {
      resourceHash.raw_configs = resourceHash.raw_configs.map((config) => {
        config.mergeMode = config.merge_mode;
        delete config.merge_mode;
        return config;
      });
    }

    return this._super(modelClass, resourceHash);
  },

  serialize: function (snapshot, options) {
    return {
      request: {
        branch: snapshot.attr('branchName'),
        sha: snapshot.belongsTo('commit').attr('sha'),
        message: snapshot.attr('message'),
        configs: configsFrom(snapshot.attr('configs'))
      }
    };
  }
});

function configsFrom(configs) {
  configs = configs.filter(config => config.config);
  if (configs.length === 0) configs = [{ config: '' }];
  return configs.map(config => ({ config: config.config, mode: config.mergeMode }));
}
