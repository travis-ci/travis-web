import Ember from 'ember';
import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({

  findRecord(store, type, id, record) {
    return this.ajax(this.urlPrefix() + '/cron/' + id, 'GET');
  },

  deleteRecord(store, type, record) {
    return this.ajax(this.urlPrefix() + '/cron/' + record.id, "DELETE");
  },

  createRecord(store, type, record) {
    var data, serializer;
    data = {};
    serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {});

    return this.ajax(this.urlPrefix() + '/repo/' + record.branch.repo.id + '/branch/' + record.branch.name + '/cron', "POST", {
      data: data
    });
  },

  ajaxOptions(url, type, options) {
    var hash = this._super(url, type, options);

    hash.headers['accept'] = 'application/json';
    hash.headers['Travis-API-Version'] = '3';
    hash.headers['Content-Type'] = 'application/json';

    return hash;
  }

});
