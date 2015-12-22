import DS from 'ember-data';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

export default V2FallbackSerializer.extend({
  isNewSerializerAPI: true
});
