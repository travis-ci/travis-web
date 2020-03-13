import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default V3Adapter.extend({
  ajax: service(),

  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Client-Release': config.release
  },

  token: reads('auth.token'),

  queryRecord(store, type, { id, data }) {
    const url = `${apiEndpoint}/repo/${id}/request/config`;
    const headers = { ...this.headers, Authorization: `token ${this.token}` };
    const options = { data, headers: headers};
    return this.ajax.request(url, 'POST', options);
  },
});
