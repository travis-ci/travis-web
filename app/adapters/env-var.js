import Ember from 'ember';
import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  buildURL(type, id, record) {
    var delimiter, repoId, url;
    url = this._super.apply(this, arguments);
    if (record && (repoId = Ember.get(record, 'repo.id'))) {
      delimiter = url.indexOf('?') !== -1 ? '&' : '?';
      url = "" + url + delimiter + "repository_id=" + repoId;
    }
    return url;
  },

  updateRecord(store, type, record) {
    var data, id, serializer;
    data = {};
    serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record);
    id = Ember.get(record, 'id');
    return this.ajax(this.buildURL(type.modelName, id, record), "PATCH", {
      data: data
    });
  }
});
