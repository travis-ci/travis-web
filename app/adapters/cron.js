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

    return this.ajax(this.urlPrefix() + data.branch + '/cron', "POST", {
      data: {
        disable_by_build: data.disable_by_build,
        interval: data.interval
      }
    });
  },

  query(store, type, query) {
    var repo_id = query["repository_id"];
    delete query["repository_id"];
    return this.ajax( this.urlPrefix() + '/v3/repo/' + repo_id + '/crons', "GET", query);
  },

  ajaxOptions(url, type, options) {
    var hash = this._super(url, type, options);

    hash.headers['accept'] = 'application/json';
    hash.headers['Travis-API-Version'] = '3';
    hash.headers['Content-Type'] = 'application/json';

    return hash;
  }

});
