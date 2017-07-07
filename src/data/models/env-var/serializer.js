import ApplicationSerializer from "travis/src/data/models/application/serializer";

export default ApplicationSerializer.extend({
  attrs: {
    repo: { key: 'repository_id' }
  },

  serialize(snapshot, options) {
    return { env_var: this._super(snapshot, options) };
  },

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    payload = payload.env_var;
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
