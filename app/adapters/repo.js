import V3Adapter from 'travis/adapters/v3';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch,repository.current_build,build.commit',

  byOwner(owner) {
    const url = `${apiEndpoint}/owner/${owner}/repos`;
    return this.ajax(url, 'GET');
  },
});
