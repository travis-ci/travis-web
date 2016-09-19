import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  buildURL(type, id, record) {
    let repoId, url;
    url = this._super(...arguments);
    if (record && record.belongsTo('repo') && (repoId = record.belongsTo('repo').id)) {
      const delimiter = url.indexOf('?') !== -1 ? '&' : '?';
      url = `${url}${delimiter}repository_id=${repoId}`;
    }
    return url;
  },

  updateRecord(store, type, record) {
    let data, serializer;
    data = {};
    serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record);
    let id = record.id;
    return this.ajax(this.buildURL(type.modelName, id, record), 'PATCH', {
      data: data
    });
  }
});
