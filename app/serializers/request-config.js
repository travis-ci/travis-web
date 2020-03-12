import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  normalize(modelClass, resourceHash) {
    resourceHash.id = new Date().getTime();

    return this._super(...arguments);
  },
});
