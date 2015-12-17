import ApplicationSerializer from 'travis/serializers/application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    return { ssh_key: this._super(...arguments) };
  },

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    payload = payload.ssh_key;
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
