import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  queryRecord(store, type, { id, data }) {
    const url = `${this.buildURL('repo', id)}/request/config`;
    return this.ajax(url, 'POST', { data });
  },
});
