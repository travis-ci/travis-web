import V3Adapter from 'travis/adapters/v3';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default V3Adapter.extend({
  queryRecord(store, type, { id, data }) {
    const url = `${apiEndpoint}/repo/${id}/request/config`;
    return this.ajax(url, 'POST', { data });
  },
});
