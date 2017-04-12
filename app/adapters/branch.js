import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repoId;
    const active = query.existsOnGithub;
    const offset = query.offset || 0;
    delete query.existsOnGithub;
    delete query.repoId;

    const url = `${this.urlPrefix()}/repo/${repoId}/branches
?exists_on_github=${active}&include=build.commit&offset=${offset}`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },
});
