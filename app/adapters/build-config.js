import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';

export default V3Adapter.extend({
  ajax: service(),
  host: 'https://yml-staging.travis-ci.org',

  queryRecord(store, type, query) {
    return this.ajax.request('/configs', 'POST', {
      host: this.host,
      data: query.data,
      headers: {
        Authorization: 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'
      }
    });
  }
});
