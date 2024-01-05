import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'cron.branch',

  createRecord(store, type, record) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {});

    const url = `${this.getHost()}${data.branch}/cron`;
    return this.ajax(url, 'POST', {
      data: {
        dont_run_if_recent_build_exists: data.dont_run_if_recent_build_exists,
        interval: data.interval
      }
    }).then(response => {
      if (!response.id) {
        response.id = 'temp-id-' + new Date().getTime(); // we do not need id at least in tests but Ember needs it.
      }
      return response;
    });;
  },

  query(store, type, query) {
    const repoId = query['repository_id'];
    delete query['repository_id'];
    const url = `${this.urlPrefix()}/repo/${repoId}/crons`;
    return this.ajax(url, 'GET', query);
  }

});
