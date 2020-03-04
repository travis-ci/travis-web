import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

const { ymlEndpoint: host } = config;

export default V3Adapter.extend({
  ajax: service(),

  getOptions(data) {
    return { host, data, headers: { Authorization: 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn' }};
  },

  queryRecord(store, type, { data }) {
    const options = this.getOptions(data);
    return this.ajax.request('/configs', 'POST', options);
  },
});
