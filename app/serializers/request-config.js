import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  normalize(modelClass, resourceHash) {
    resourceHash.id = new Date().getTime();
    console.log(resourceHash);

    return this._super(...arguments);
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
      mode: snapshot.attr('mode'),
      config: snapshot.attr('config') || '',
      data: {
        repo: snapshot.belongsTo('repo').attr('slug'),
        branch: snapshot.attr('branch'),
        message: snapshot.attr('message'),
      }
    };
  }
});
