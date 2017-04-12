import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repository_id;
    delete query.repository_id;
    const url = `${this.urlPrefix()}/repo/${repoId}/branches`;

    if (!query.data) {
      query.data = {};
    }

    // FIXME this is a temporary solution for https://github.com/travis-pro/team-teal/issues/1762
    query.data.limit = 100;

    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },
});
