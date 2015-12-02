import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if(!id && requestType === 'findRecord') {
      id = payload.id;
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});

export default Serializer;
