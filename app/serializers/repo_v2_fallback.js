import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  normalize: function (modelClass, resourceHash) {
    if (!resourceHash['@type']) {
      let slug = resourceHash.slug;

      if (slug && !resourceHash.name) {
        resourceHash.name = slug.split('/')[1];
      }

      if (slug && !resourceHash.owner) {
        resourceHash.owner = { login: slug.split('/')[0] };
      }
    }

    return this._super(modelClass, resourceHash);
  }
});

export default Serializer;
