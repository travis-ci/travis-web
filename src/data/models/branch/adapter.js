import V3Adapter from "travis/src/data/models/v3/adapter";

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repository_id;
    delete query.repository_id;
    const url = `${this.urlPrefix()}/repo/${repoId}/branches`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },
});
