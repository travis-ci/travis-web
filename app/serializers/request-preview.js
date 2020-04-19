import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  normalize(modelClass, resourceHash) {
    const hash = this._super(modelClass, {
      '@type': 'request_preview',
      id: new Date().getTime(),
      config: resourceHash.request_config.config,
      raw_configs: resourceHash.raw_configs,
      job_configs: resourceHash.job_configs.map((hash) => hash.config),
      messages: resourceHash.messages
    });
    return hash;
  },

  serialize(snapshot, options) {
    return {
      type: 'api',
      repo: {
        slug: snapshot.belongsTo('repo').attr('slug'),
        private: snapshot.belongsTo('repo').attr('slug'),
        default_branch: snapshot.belongsTo('repo').belongsTo('defaultBranch').attr('name'),
      },
      branch: snapshot.attr('branch'),
      sha: snapshot.attr('sha'),
      configs: snapshot.attr('configs'),
      data: {
        repo: snapshot.belongsTo('repo').attr('slug'),
        branch: snapshot.attr('branch'),
        message: snapshot.attr('message'),
      }
    };
  },
});
