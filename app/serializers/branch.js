import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

export default V2FallbackSerializer.extend({
  extractAttributes(klass, payload) {
    payload.id = payload['@href'];
    return this._super(...arguments);
  },
  extractId(modelClass, resourceHash) {
    return resourceHash.id || resourceHash['@href'];
  }
});
