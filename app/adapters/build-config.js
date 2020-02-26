import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';

export default V3Adapter.extend({
  ajax: service(),
  host: 'https://yml-staging.travis-ci.org',

  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType === 'queryRecord') {
      return '/configs';
    }
  },

  queryRecord(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'queryRecord', query);
    return this.ajax.request(url, 'POST', {
      host: this.host,
      data: query.data,
      headers: {
        Authorization: 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'
      }
    });
  }
});
