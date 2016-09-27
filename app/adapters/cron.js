import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({

  createRecord(store, type, record) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {});

    const url = `${this.urlPrefix()}${data.branch}/cron`;
    return this.ajax(url, 'POST', {
      data: {
        disable_by_build: data.disable_by_build,
        interval: data.interval
      }
    });
  },

  query(store, type, query) {
    const repoId = query['repository_id'];
    delete query['repository_id'];
    const url = `${this.urlPrefix()}/v3/repo/${repoId}/crons`;
    return this.ajax(url, 'GET', query);
  }

});
