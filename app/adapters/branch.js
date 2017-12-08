import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const repoId = query.repository_id;
    delete query.repository_id;

    let queryParams = '';

    if (query.name_filter) {
      queryParams = `?name_filter=${query.name_filter}`;
    }

    const url = `${this.urlPrefix()}/repo/${repoId}/branches${queryParams}`;
    return this.ajax(url, 'GET', query);
  },

  findRecord(store, type, id) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },
});
