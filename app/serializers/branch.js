import V3Serializer from 'travis/serializers/v3';

const Serializer = V3Serializer.extend({
  extractAttributes(klass, payload) {
    payload.id = payload['@href'];
    return this._super(...arguments);
  },

  extractId(modelClass, resourceHash) {
    return resourceHash.id || resourceHash['@href'];
  }
});

export default Serializer;
