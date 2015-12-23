import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    _config: { key: 'config' },
    _finished_at: { key: 'finished_at' },
    _started_at:  { key: 'started_at' }
  },

  keyForV2Relationship(key, typeClass, method) {
    if (key === 'repo') {
      return 'repository_id';
    } else {
      return this._super.apply(this, arguments);
    }
  },

  normalize(modelClass, resourceHash) {
    if (resourceHash.commit) {
      resourceHash.commit['type'] = 'commit';
    }

    return this._super(modelClass, resourceHash);
  }
});

export default Serializer;
