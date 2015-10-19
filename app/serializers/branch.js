import Ember from 'ember';
import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  extractAttributes(klass, payload) {
    payload.id = payload['@href'];
    return this._super(...arguments);
  },
  extractId(modelClass, resourceHash) {
    return resourceHash.id || resourceHash['@href'];
  }
});
