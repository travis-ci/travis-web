import V2FallbackSerializer from "travis/src/data/models/v2_fallback/serializer";

export default V2FallbackSerializer.extend({
  extractAttributes(klass, payload) {
    payload.id = payload['@href'];
    return this._super(...arguments);
  },

  extractId(modelClass, resourceHash) {
    return resourceHash.id || resourceHash['@href'];
  }
});
