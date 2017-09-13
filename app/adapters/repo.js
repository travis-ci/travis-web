import V3Adapter from 'travis/adapters/v3';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch'
  + ',repository.current_build,build.commit',

  buildURL(modelName, id, snapshot, requestType, query) {
    if (query) {
      const custom = query.custom;
      if (custom && custom.type === 'byOwner') {
        const { owner } = custom;
        return `${apiEndpoint}/owner/${owner}/repos`;
      }
    }
    return this._super(...arguments);
  },
});
