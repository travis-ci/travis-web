import V3Serializer from 'travis/serializers/v3';

var Serializer = V3Serializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    startedAt: { key: 'started_at' },
    finishedAt: { key: 'finishedAt' },
  },

  extractRelationship(relationshipModelName, relationshipHash) {
    if (relationshipModelName === 'repo') {
      relationshipHash['@type'] = 'repo';
    }
    return this._super(...arguments);
  },

  keyForRelationship(key, relationship, method) {
    if (key === 'repo' && relationship === 'belongsTo' && method === 'deserialize') {
      return 'repository';
    } else {
      return this._super(...arguments);
    }
  },
});

export default Serializer;
