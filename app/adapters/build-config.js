import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

const { yml: host } = config.urls;

export default V3Adapter.extend({
  ajax: service(),

  getOptions(query) {
    return {
      host,
      data: query.data,
      headers: {
        Authorization: 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'
      },
    };
  },

  queryRecord(store, type, query) {
    const options = this.getOptions(query);
    return this.ajax.request('/configs', 'POST', options);
  }
});
