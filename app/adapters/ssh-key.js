import Ember from 'ember';
import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  findRecord(store, type, id, record) {
    return this.ajax(this.urlPrefix() + '/ssh_key/' + id, 'GET');
  },

  deleteRecord(store, type, record) {
    var id;
    id = Ember.get(record, 'id');
    return this.ajax(this.urlPrefix() + '/ssh_key/' + id, "DELETE");
  },

  createRecord(store, type, record) {
    var data, id, serializer;
    data = {};
    serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {
      includeId: true
    });
    id = Ember.get(record, 'id');
    return this.ajax(this.urlPrefix() + '/ssh_key/' + id, "PATCH", {
      data: data
    });
  }
});
