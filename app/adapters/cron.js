import Ember from 'ember';
import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({

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
    var repo_id = query['repository_id'];
    delete query['repository_id'];
    return this.ajax( this.urlPrefix() + '/v3/repo/' + repo_id + '/crons', "GET", query);
  },

});
