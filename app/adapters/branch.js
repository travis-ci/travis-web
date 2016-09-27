import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  query(store, type, query) {
    const repoId = query.repository_id;
    delete query.repository_id;
    const url = `${this.urlPrefix()}/v3/repo/${repoId}/branches`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  }
});
