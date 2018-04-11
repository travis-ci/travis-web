import V3Adapter from 'travis/adapters/v3';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default V3Adapter.extend({
  defaultSerializer: '-organization',

  buildURL(modelName, id, snapshot, requestType, query) {
    if (query) {
      return `${apiEndpoint}/orgs`;
    }
    return this._super(...arguments);
  },
});
