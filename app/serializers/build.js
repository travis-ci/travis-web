import BuildV2FallbackSerializer from 'travis/serializers/build_v2_fallback';

var Serializer = BuildV2FallbackSerializer.extend({
  attrs: {
    _config: { key: 'config' },
    _duration: { key: 'duration' }
  },

  keyForRelationship(key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository';
    } else {
      return this._super(...arguments);
    }
  },

  normalize: function (modelClass, resourceHash) {
    if (resourceHash['event_type'] == 'pull_request' &&
          !resourceHash.hasOwnProperty('pull_request')) {
      // in V3 we don't return "pull_request" property as we rely on event_type
      // value. This line makes V3 payloads also populate pull_request property
      resourceHash['pull_request'] = true;
    }

    return this._super(modelClass, resourceHash);
  }
});

export default Serializer;
