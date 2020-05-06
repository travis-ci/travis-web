import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  serialize(snapshot, options) {
    const { forLocalStorage } = options || {};

    if (forLocalStorage) {
      return this._super(...arguments);
    } else {
      return {
        utm_params: snapshot.attr('utmParams') || ''
      };
    }
  }
});
