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
      delete query.includeCommit;
    }

    let includeRecent = '';
    if (query.includeRecent) {
      includeRecent = '&include=branch.recent_builds';
      delete query.includeRecent;
    }

    const url = `${this.urlPrefix()}/repo/${repoId}/branches
?exists_on_github=${active}${includeCommit}${includeRecent}&
offset=${offset}&sort_by=last_build:desc`;
    return this.ajax(url, 'GET', query);
  },


  findRecord(store, type, id) {
    return this.ajax(`${this.urlPrefix()}${id}?
include=last_build.commit,branch.recent_builds`, 'GET');
  }
});
