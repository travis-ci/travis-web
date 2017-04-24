import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repoId;
    const active = query.existsOnGithub;
    const offset = query.offset || 0;
    delete query.existsOnGithub;
    delete query.repoId;

    let includeCommit = '';
    if (query.includeCommit) {
      includeCommit = '&include=build.commit';
    }
    delete query.includeCommit;

    const url = `${this.urlPrefix()}/repo/${repoId}/branches
?exists_on_github=${active}${includeCommit}&offset=${offset}`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    // todo find repoID
    let repoId = 269284;

    return this.ajax(`${this.urlPrefix()}/repo/${repoId}/branch/${id}`, 'GET');
  },
});
