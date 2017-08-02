import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  queryRecord(store, type, query) {
    const login = query.login;
    delete query.login;
    const url = `${this.urlPrefix()}/owner/${login}`;
    return this.ajax(url, 'GET', query);
  }
});
