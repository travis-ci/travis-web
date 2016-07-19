import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  findRecord(store, type, id) {
    return this.ajax(`${this.urlPrefix()}/ssh_key/${id}`, 'GET');
  },

  deleteRecord(store, type, record) {
    const id = record.id;
    return this.ajax(`${this.urlPrefix()}/ssh_key/${id}`, 'DELETE');
  },

  createRecord(store, type, record) {
    let data, serializer;
    data = {};
    serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {
      includeId: true
    });

    const id = record.id;
    return this.ajax(`${this.urlPrefix()}/ssh_key/${id}`, 'PATCH', {
      data
    });
  }
});
