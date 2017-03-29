import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repository_id;
    const active = query.exists_on_github;
    const offset = query.offset || 0;
    delete query.exists_on_github;
    delete query.repository_id;

    const url = `${this.urlPrefix()}/repo/${repoId}/branches
?exists_on_github=${active}&include=build.commit&offset=${offset}`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },
});
