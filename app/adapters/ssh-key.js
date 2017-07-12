import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  urlPrefix() {
    const prefix = this._super(...arguments);

    if (prefix.indexOf('http') === -1) {
      return `/${prefix}`;
    } else {
      return prefix;
    }
  },

  findRecord(store, type, id) {
    const url = `${this.urlPrefix()}/ssh_key/${id}`;
    return this.ajax(url, 'GET');
  },

  deleteRecord(store, type, record) {
    const url = `${this.urlPrefix()}/ssh_key/${record.id}`;
    return this.ajax(url, 'DELETE');
  },

  createRecord(store, type, record) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {
      includeId: true
    });

    const url = `${this.urlPrefix()}/ssh_key/${record.id}`;
    return this.ajax(url, 'PATCH', { data });
  }
});
